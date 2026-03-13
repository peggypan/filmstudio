import { Injectable } from '@nestjs/common';

@Injectable()
export class CastService {
  async findAll() {
    return {
      data: [],
      message: '获取演员列表成功',
    };
  }

  async create(createCastDto: any) {
    return {
      data: createCastDto,
      message: '添加演员成功',
    };
  }
}
