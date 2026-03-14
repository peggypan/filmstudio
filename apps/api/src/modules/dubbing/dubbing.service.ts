import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDubbingDto } from './dto/create-dubbing.dto';
import { UpdateDubbingDto } from './dto/update-dubbing.dto';

@Injectable()
export class DubbingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createDubbingDto: CreateDubbingDto) {
    const { projectId, ...dubbingData } = createDubbingDto;

    await this.verifyProjectOwnership(userId, projectId);

    const dubbing = await this.prisma.dubbing.create({
      data: {
        ...dubbingData,
        projectId,
        status: 'pending',
      },
    });

    return dubbing;
  }

  async findAll(userId: string, query: { projectId?: string; status?: string }) {
    const { projectId, status } = query;

    const where: any = {};

    if (projectId) {
      await this.verifyProjectOwnership(userId, projectId);
      where.projectId = projectId;
    } else {
      const userProjects = await this.prisma.project.findMany({
        where: { ownerId: userId },
        select: { id: true },
      });
      where.projectId = {
        in: userProjects.map(p => p.id),
      };
    }

    if (status) {
      where.status = status;
    }

    const dubbings = await this.prisma.dubbing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return dubbings;
  }

  async findOne(userId: string, id: string) {
    const dubbing = await this.prisma.dubbing.findUnique({
      where: { id },
      include: {
        project: { select: { ownerId: true } },
      },
    });

    if (!dubbing) {
      throw new NotFoundException('配音不存在');
    }

    if (dubbing.project.ownerId !== userId) {
      throw new ForbiddenException('无权访问此配音');
    }

    return dubbing;
  }

  async update(userId: string, id: string, updateDubbingDto: UpdateDubbingDto) {
    await this.findOne(userId, id);

    const dubbing = await this.prisma.dubbing.update({
      where: { id },
      data: updateDubbingDto,
    });

    return dubbing;
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.dubbing.delete({ where: { id } });

    return { message: '配音删除成功' };
  }

  async synthesize(userId: string, id: string) {
    const dubbing = await this.findOne(userId, id);

    // TODO: 接入 ElevenLabs API 进行语音合成
    // 更新状态为处理中
    await this.prisma.dubbing.update({
      where: { id },
      data: { status: 'processing' },
    });

    // 模拟合成完成
    await this.prisma.dubbing.update({
      where: { id },
      data: {
        status: 'completed',
        audioUrl: `https://example.com/audio/${id}.mp3`,
      },
    });

    return {
      message: '配音合成完成（当前为模拟数据，接入ElevenLabs后将真实合成）',
      dubbing: await this.prisma.dubbing.findUnique({ where: { id } }),
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
