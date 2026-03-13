import { Injectable } from '@nestjs/common';

@Injectable()
export class ScriptService {
  async findAll() {
    return {
      data: [],
      message: '获取剧本列表成功',
    };
  }

  async findOne(id: string) {
    return {
      data: { id, title: '示例剧本' },
      message: '获取剧本详情成功',
    };
  }

  async create(createScriptDto: any) {
    return {
      data: createScriptDto,
      message: '创建剧本成功',
    };
  }

  async generate(id: string, prompt: any) {
    return {
      data: { id, content: 'AI生成的剧本内容...' },
      message: 'AI生成剧本成功',
    };
  }
}
