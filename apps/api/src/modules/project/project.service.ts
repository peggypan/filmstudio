import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createProjectDto: CreateProjectDto) {
    const project = await this.prisma.project.create({
      data: {
        ...createProjectDto,
        ownerId: userId,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            scripts: true,
          },
        },
      },
    });

    return project;
  }

  async findAll(userId: string, query: { status?: string; search?: string }) {
    const { status, search } = query;

    const where: any = {
      ownerId: userId,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const projects = await this.prisma.project.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            scripts: true,
          },
        },
      },
    });

    return projects;
  }

  async findOne(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        scripts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        _count: {
          select: {
            scripts: true,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('项目不存在');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('无权访问此项目');
    }

    return project;
  }

  async update(userId: string, projectId: string, updateProjectDto: UpdateProjectDto) {
    // 先检查项目是否存在且属于当前用户
    await this.findOne(userId, projectId);

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: updateProjectDto,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            scripts: true,
          },
        },
      },
    });

    return project;
  }

  async remove(userId: string, projectId: string) {
    // 先检查项目是否存在且属于当前用户
    await this.findOne(userId, projectId);

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { message: '项目删除成功' };
  }

  async updateProgress(userId: string, projectId: string, progress: number) {
    // 先检查项目是否存在且属于当前用户
    await this.findOne(userId, projectId);

    const project = await this.prisma.project.update({
      where: { id: projectId },
      data: { progress },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        _count: {
          select: {
            scripts: true,
          },
        },
      },
    });

    return project;
  }
}
