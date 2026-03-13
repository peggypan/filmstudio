import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CastService } from './cast.service';

@ApiTags('演员管理')
@Controller('cast')
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Get()
  @ApiOperation({ summary: '获取演员列表' })
  findAll() {
    return this.castService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '添加演员' })
  create(@Body() createCastDto: any) {
    return this.castService.create(createCastDto);
  }
}
