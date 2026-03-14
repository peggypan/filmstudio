import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CastService } from './cast.service';
import { CreateCastDto } from './dto/create-cast.dto';
import { UpdateCastDto } from './dto/update-cast.dto';

@ApiTags('演员管理')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('casts')
export class CastController {
  constructor(private readonly castService: CastService) {}

  @Post()
  @ApiOperation({ summary: '创建演员' })
  create(@Body() createCastDto: CreateCastDto) {
    return this.castService.create(createCastDto);
  }

  @Get()
  @ApiOperation({ summary: '获取演员列表' })
  @ApiQuery({ name: 'type', required: false, description: '按类型筛选: actor, director, producer, crew, other' })
  @ApiQuery({ name: 'search', required: false, description: '搜索姓名或简介' })
  findAll(@Query() query: { type?: string; search?: string }) {
    return this.castService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取演员详情' })
  findOne(@Param('id') id: string) {
    return this.castService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新演员信息' })
  update(@Param('id') id: string, @Body() updateCastDto: UpdateCastDto) {
    return this.castService.update(id, updateCastDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除演员' })
  remove(@Param('id') id: string) {
    return this.castService.remove(id);
  }
}
