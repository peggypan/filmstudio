import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DubbingService } from './dubbing.service';
import { CreateDubbingDto } from './dto/create-dubbing.dto';
import { UpdateDubbingDto } from './dto/update-dubbing.dto';

@ApiTags('配音管理')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('dubbings')
export class DubbingController {
  constructor(private readonly dubbingService: DubbingService) {}

  @Post()
  @ApiOperation({ summary: '创建配音任务' })
  create(@Req() req, @Body() createDubbingDto: CreateDubbingDto) {
    return this.dubbingService.create(req.user.userId, createDubbingDto);
  }

  @Get()
  @ApiOperation({ summary: '获取配音列表' })
  @ApiQuery({ name: 'projectId', required: false, description: '按项目筛选' })
  @ApiQuery({ name: 'status', required: false, description: '按状态筛选' })
  findAll(@Req() req, @Query() query: { projectId?: string; status?: string }) {
    return this.dubbingService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取配音详情' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.dubbingService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新配音信息' })
  update(@Req() req, @Param('id') id: string, @Body() updateDubbingDto: UpdateDubbingDto) {
    return this.dubbingService.update(req.user.userId, id, updateDubbingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除配音' })
  remove(@Req() req, @Param('id') id: string) {
    return this.dubbingService.remove(req.user.userId, id);
  }

  @Post(':id/synthesize')
  @ApiOperation({ summary: '合成配音（模拟ElevenLabs）' })
  synthesize(@Req() req, @Param('id') id: string) {
    return this.dubbingService.synthesize(req.user.userId, id);
  }
}
