import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MusicService } from './music.service';
import { CreateMusicDto } from './dto/create-music.dto';
import { UpdateMusicDto } from './dto/update-music.dto';

@ApiTags('配乐管理')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('musics')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post()
  @ApiOperation({ summary: '添加配乐' })
  create(@Req() req, @Body() createMusicDto: CreateMusicDto) {
    return this.musicService.create(req.user.userId, createMusicDto);
  }

  @Get()
  @ApiOperation({ summary: '获取配乐列表' })
  @ApiQuery({ name: 'projectId', required: false, description: '按项目筛选' })
  @ApiQuery({ name: 'style', required: false, description: '按风格筛选' })
  @ApiQuery({ name: 'license', required: false, description: '按许可证筛选' })
  @ApiQuery({ name: 'search', required: false, description: '搜索名称' })
  findAll(
    @Req() req,
    @Query() query: { projectId?: string; style?: string; license?: string; search?: string },
  ) {
    return this.musicService.findAll(req.user.userId, query);
  }

  @Get('recommend')
  @ApiOperation({ summary: '推荐配乐（AI推荐接口）' })
  @ApiQuery({ name: 'mood', required: false, description: '情绪: happy, sad, tense...' })
  @ApiQuery({ name: 'duration', required: false, description: '目标时长(秒)' })
  @ApiQuery({ name: 'style', required: false, description: '风格' })
  recommend(
    @Req() req,
    @Query() query: { mood?: string; duration?: number; style?: string },
  ) {
    return this.musicService.recommend(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取配乐详情' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.musicService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新配乐信息' })
  update(@Req() req, @Param('id') id: string, @Body() updateMusicDto: UpdateMusicDto) {
    return this.musicService.update(req.user.userId, id, updateMusicDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除配乐' })
  remove(@Req() req, @Param('id') id: string) {
    return this.musicService.remove(req.user.userId, id);
  }
}
