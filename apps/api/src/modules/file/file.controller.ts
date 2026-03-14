import {
  Controller,
  Post,
  Delete,
  Get,
  UseInterceptors,
  UploadedFile,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { FileService } from './file.service'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  /**
   * 上传头像
   * POST /files/upload/avatar
   */
  @Post('upload/avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any
  ) {
    const result = await this.fileService.uploadFile(file, 'avatar')
    return {
      success: true,
      data: result,
    }
  }

  /**
   * 上传音乐文件
   * POST /files/upload/music
   */
  @Post('upload/music')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMusic(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any
  ) {
    const result = await this.fileService.uploadFile(file, 'music')
    return {
      success: true,
      data: result,
    }
  }

  /**
   * 上传分镜图
   * POST /files/upload/storyboard
   */
  @Post('upload/storyboard')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStoryboard(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any
  ) {
    const result = await this.fileService.uploadFile(file, 'storyboard')
    return {
      success: true,
      data: result,
    }
  }

  /**
   * 通用文件上传
   * POST /files/upload
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('type') type: string,
    @CurrentUser() user: any
  ) {
    const validTypes = ['avatar', 'music', 'storyboard', 'script', 'other']
    const fileType = validTypes.includes(type) ? type : 'other'
    const result = await this.fileService.uploadFile(file, fileType as any)
    return {
      success: true,
      data: result,
    }
  }

  /**
   * 删除文件
   * DELETE /files/:url
   */
  @Delete('*')
  async deleteFile(@Param() params: any) {
    const fileUrl = Object.values(params).join('/')
    await this.fileService.deleteFile('/' + fileUrl)
    return {
      success: true,
      message: '文件已删除',
    }
  }

  /**
   * 获取文件统计
   * GET /files/stats
   */
  @Get('stats')
  async getStats() {
    const stats = await this.fileService.getStats()
    return {
      success: true,
      data: stats,
    }
  }
}
