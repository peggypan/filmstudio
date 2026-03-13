import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ScriptService } from './script.service';

@ApiTags('剧本管理')
@Controller('scripts')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Get()
  @ApiOperation({ summary: '获取剧本列表' })
  findAll() {
    return this.scriptService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取剧本详情' })
  findOne(@Param('id') id: string) {
    return this.scriptService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '创建剧本' })
  create(@Body() createScriptDto: any) {
    return this.scriptService.create(createScriptDto);
  }

  @Post(':id/generate')
  @ApiOperation({ summary: 'AI生成剧本' })
  generate(@Param('id') id: string, @Body() prompt: any) {
    return this.scriptService.generate(id, prompt);
  }
}
