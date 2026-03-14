import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCastDto } from './dto/create-cast.dto';
import { UpdateCastDto } from './dto/update-cast.dto';

@Injectable()
export class CastService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCastDto: CreateCastDto) {
    const cast = await this.prisma.cast.create({
      data: createCastDto,
    });

    return cast;
  }

  async findAll(query: { type?: string; search?: string }) {
    const { type, search } = query;

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
      ];
    }

    const casts = await this.prisma.cast.findMany({
      where,
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return casts;
  }

  async findOne(id: string) {
    const cast = await this.prisma.cast.findUnique({
      where: { id },
    });

    if (!cast) {
      throw new NotFoundException('演员不存在');
    }

    return cast;
  }

  async update(id: string, updateCastDto: UpdateCastDto) {
    await this.findOne(id);

    const cast = await this.prisma.cast.update({
      where: { id },
      data: updateCastDto,
    });

    return cast;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.cast.delete({
      where: { id },
    });

    return { message: '演员删除成功' };
  }
}
