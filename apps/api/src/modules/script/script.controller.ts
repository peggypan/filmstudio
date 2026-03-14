import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ScriptService } from './script.service';
import { CreateScriptDto } from './dto/create-script.dto';
import { UpdateScriptDto } from './dto/update-script.dto';
import { GenerateScriptDto } from './dto/generate-script.dto';

@ApiTags('剧本管理')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('scripts')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Post()
  @ApiOperation({ summary: '创建剧本' })
  create(@Req() req, @Body() createScriptDto: CreateScriptDto) {
    return this.scriptService.create(req.user.userId, createScriptDto);
  }

  @Get()
  @ApiOperation({ summary: '获取剧本列表' })
  @ApiQuery({ name: 'projectId', required: false, description: '按项目筛选' })
  @ApiQuery({ name: 'status', required: false, description: '按状态筛选: draft, reviewing, finalized' })
  @ApiQuery({ name: 'search', required: false, description: '搜索标题或内容' })
  findAll(@Req() req, @Query() query: { projectId?: string; status?: string; search?: string }) {
    return this.scriptService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取剧本详情' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.scriptService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新剧本' })
  update(@Req() req, @Param('id') id: string, @Body() updateScriptDto: UpdateScriptDto) {
    return this.scriptService.update(req.user.userId, id, updateScriptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除剧本' })
  remove(@Req() req, @Param('id') id: string) {
    return this.scriptService.remove(req.user.userId, id);
  }

  @Post('generate')
  @ApiOperation({ summary: 'AI生成剧本（模拟）' })
  generate(@Req() req, @Body() generateScriptDto: GenerateScriptDto) {
    // projectId 从 DTO 中获取
    return this.scriptService.generate(req.user.userId, generateScriptDto.projectId, generateScriptDto);
  }
}
