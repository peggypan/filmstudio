import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('项目管理')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiOperation({ summary: '创建项目' })
  create(@Req() req, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(req.user.userId, createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: '获取项目列表' })
  @ApiQuery({ name: 'status', required: false, description: '按状态筛选: active, paused, completed, archived' })
  @ApiQuery({ name: 'search', required: false, description: '搜索项目名称或描述' })
  findAll(@Req() req, @Query() query: { status?: string; search?: string }) {
    return this.projectService.findAll(req.user.userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取项目详情' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.projectService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '更新项目' })
  update(@Req() req, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(req.user.userId, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除项目' })
  remove(@Req() req, @Param('id') id: string) {
    return this.projectService.remove(req.user.userId, id);
  }

  @Patch(':id/progress')
  @ApiOperation({ summary: '更新项目进度' })
  updateProgress(@Req() req, @Param('id') id: string, @Body('progress') progress: number) {
    return this.projectService.updateProgress(req.user.userId, id, progress);
  }
}
