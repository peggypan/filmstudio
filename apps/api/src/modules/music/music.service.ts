import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';

@Injectable()
export class MusicService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createMusicDto: CreateMusicDto) {
    const { projectId, ...musicData } = createMusicDto;

    // 如果指定了项目ID，验证权限
    if (projectId) {
      await this.verifyProjectOwnership(userId, projectId);
    }

    const music = await this.prisma.music.create({
      data: {
        ...musicData,
        projectId: projectId || null,
      },
    });

    return music;
  }

  async findAll(userId: string, query: { projectId?: string; style?: string; license?: string; search?: string }) {
    const { projectId, style, license, search } = query;

    const where: any = {};

    // 如果指定了项目ID，验证权限并筛选
    if (projectId) {
      await this.verifyProjectOwnership(userId, projectId);
      where.projectId = projectId;
    } else {
      // 显示用户的项目音乐 + 公共音乐(未关联项目的)
      const userProjects = await this.prisma.project.findMany({
        where: { ownerId: userId },
        select: { id: true },
      });
      where.OR = [
        { projectId: { in: userProjects.map(p => p.id) } },
        { projectId: null },
      ];
    }

    if (style) {
      where.style = style;
    }

    if (license) {
      where.license = license;
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const musics = await this.prisma.music.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return musics;
  }

  async findOne(userId: string, id: string) {
    const music = await this.prisma.music.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
    });

    if (!music) {
      throw new NotFoundException('配乐不存在');
    }

    // 如果是公共音乐(projectId为null)，任何人可访问
    // 否则验证项目所有权
    if (music.projectId && music.project?.ownerId !== userId) {
      throw new ForbiddenException('无权访问此配乐');
    }

    return music;
  }

  async update(userId: string, id: string, updateMusicDto: UpdateMusicDto) {
    const music = await this.findOne(userId, id);

    const { projectId, ...musicData } = updateMusicDto;

    // 如果更改项目，验证新项目权限
    if (projectId && projectId !== music.projectId) {
      await this.verifyProjectOwnership(userId, projectId);
    }

    const updated = await this.prisma.music.update({
      where: { id },
      data: {
        ...musicData,
        projectId: projectId !== undefined ? (projectId || null) : undefined,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return updated;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.music.delete({ where: { id } });

    return { message: '配乐删除成功' };
  }

  async recommend(userId: string, query: { mood?: string; duration?: number; style?: string }) {
    const { mood, duration, style } = query;

    // 根据情绪/时长/风格推荐音乐
    // 这里实现简单的推荐逻辑，实际可以接入 AI 推荐服务
    const where: any = {};

    if (style) {
      where.style = style;
    }

    if (duration) {
      // 允许 ±30 秒的误差
      where.duration = {
        gte: duration - 30,
        lte: duration + 30,
      };
    }

    // 获取用户可访问的音乐
    const userProjects = await this.prisma.project.findMany({
      where: { ownerId: userId },
      select: { id: true },
    });

    where.OR = [
      { projectId: { in: userProjects.map(p => p.id) } },
      { projectId: null },
    ];

    const musics = await this.prisma.music.findMany({
      where,
      take: 10,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      message: '推荐配乐（当前为基础算法，可接入AI推荐）',
      basedOn: { mood, duration, style },
      recommendations: musics,
    };
  }

  private async verifyProjectOwnership(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true },
    });

    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('无权访问此项目');
    }

    return project;
  }
}
