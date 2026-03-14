import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { GenerateScriptDto } from './dto/generate-script.dto';

@Injectable()
export class ScriptService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createScriptDto: CreateScriptDto) {
    const { projectId, ...scriptData } = createScriptDto;

    // 验证项目存在且属于当前用户
    await this.verifyProjectOwnership(userId, projectId);

    const script = await this.prisma.script.create({
      data: {
        ...scriptData,
        projectId,
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

    return script;
  }

  async findAll(userId: string, query: { projectId?: string; status?: string; search?: string }) {
    const { projectId, status, search } = query;

    const where: any = {};

    // 如果指定了项目ID，验证用户是否有权限访问
    if (projectId) {
      await this.verifyProjectOwnership(userId, projectId);
      where.projectId = projectId;
    } else {
      // 否则查询用户所有项目的剧本
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

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const scripts = await this.prisma.script.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
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

    return scripts;
  }

  async findOne(userId: string, scriptId: string) {
    const script = await this.prisma.script.findUnique({
      where: { id: scriptId },
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

    if (!script) {
      throw new NotFoundException('剧本不存在');
    }

    if (script.project.ownerId !== userId) {
      throw new ForbiddenException('无权访问此剧本');
    }

    return script;
  }

  async update(userId: string, scriptId: string, updateScriptDto: UpdateScriptDto) {
    // 先验证权限
    await this.findOne(userId, scriptId);

    const script = await this.prisma.script.update({
      where: { id: scriptId },
      data: updateScriptDto,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return script;
  }

  async remove(userId: string, scriptId: string) {
    // 先验证权限
    await this.findOne(userId, scriptId);

    await this.prisma.script.delete({
      where: { id: scriptId },
    });

    return { message: '剧本删除成功' };
  }

  async generate(userId: string, projectId: string, generateScriptDto: GenerateScriptDto) {
    // 验证项目权限
    await this.verifyProjectOwnership(userId, projectId);

    const { prompt, type, wordCount, style } = generateScriptDto;

    // TODO: 接入 OpenAI API 进行剧本生成
    // 当前返回模拟数据
    const mockGeneratedContent = this.mockGenerateScript(prompt, type, wordCount, style);

    // 创建剧本
    const script = await this.prisma.script.create({
      data: {
        title: `AI生成: ${prompt.slice(0, 30)}...`,
        content: mockGeneratedContent,
        type,
        status: 'draft',
        projectId,
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

    return {
      message: '剧本生成成功（当前为模拟数据，接入AI后将是真实生成）',
      script,
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

  private mockGenerateScript(prompt: string, type: string, wordCount?: number, style?: string): string {
    const targetLength = wordCount || 1000;
    const styleHint = style ? `，风格：${style}` : '';
    
    return `【AI生成剧本 - 模拟数据】

主题：${prompt}${styleHint}
类型：${type}
目标字数：${targetLength}

---

第一幕：开场

[场景描述]
这是一个关于"${prompt}"的故事。阳光洒落在古老的街道上...

[角色A]
（深呼吸）今天会是不同的一天。

[角色B]
（微笑）你每次都这么说。

---

第二幕：冲突

[场景描述]
夜幕降临，两人的关系面临考验...

（此处省略 ${targetLength - 200} 字的剧情内容）

---

第三幕：结局

[场景描述]
一切尘埃落定，新的开始...

[角色A]
谢谢你，一直陪在我身边。

[角色B]
（握住对方的手）我们走吧。

---

【完】

注：此为模拟生成的剧本内容。接入 OpenAI GPT-4 API 后，将生成真实、高质量的剧本内容。
`;
  }
}
