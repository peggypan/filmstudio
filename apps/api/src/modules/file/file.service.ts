import { Injectable, BadRequestException } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import * as path from 'path'

export interface UploadedFile {
  originalName: string
  fileName: string
  url: string
  size: number
  mimetype: string
}

@Injectable()
export class FileService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads')

  constructor() {
    // 确保上传目录存在
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true })
    }
    // 创建子目录
    const subdirs = ['avatars', 'music', 'storyboards', 'scripts', 'others']
    subdirs.forEach(dir => {
      const dirPath = path.join(this.uploadDir, dir)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
    })
  }

  // 上传文件
  async uploadFile(
    file: Express.Multer.File,
    type: 'avatar' | 'music' | 'storyboard' | 'script' | 'other' = 'other'
  ): Promise<UploadedFile> {
    if (!file) {
      throw new BadRequestException('没有文件')
    }

    // 验证文件类型
    this.validateFileType(file, type)

    // 生成唯一文件名
    const ext = path.extname(file.originalname)
    const fileName = `${uuidv4()}${ext}`
    const subDir = this.getSubdirectory(type)
    const filePath = path.join(this.uploadDir, subDir, fileName)

    // 保存文件
    fs.writeFileSync(filePath, file.buffer)

    // 返回文件信息
    return {
      originalName: file.originalname,
      fileName,
      url: `/uploads/${subDir}/${fileName}`,
      size: file.size,
      mimetype: file.mimetype,
    }
  }

  // 删除文件
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ''))
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error('删除文件失败:', error)
    }
  }

  // 验证文件类型
  private validateFileType(
    file: Express.Multer.File,
    type: string
  ): void {
    const allowedTypes: Record<string, string[]> = {
      avatar: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      music: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3'],
      storyboard: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
      script: ['text/plain', 'application/pdf', 'application/msword'],
      other: ['*/*'],
    }

    const allowed = allowedTypes[type] || allowedTypes.other
    if (allowed[0] !== '*/*' && !allowed.includes(file.mimetype)) {
      throw new BadRequestException(
        `不支持的文件类型: ${file.mimetype}. 允许的类型: ${allowed.join(', ')}`
      )
    }

    // 文件大小限制
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      throw new BadRequestException('文件大小不能超过 50MB')
    }
  }

  // 获取子目录
  private getSubdirectory(type: string): string {
    const dirMap: Record<string, string> = {
      avatar: 'avatars',
      music: 'music',
      storyboard: 'storyboards',
      script: 'scripts',
      other: 'others',
    }
    return dirMap[type] || 'others'
  }

  // 获取文件统计
  async getStats(): Promise<{
    totalSize: number
    totalFiles: number
    byType: Record<string, { count: number; size: number }>
  }> {
    const stats = {
      totalSize: 0,
      totalFiles: 0,
      byType: {} as Record<string, { count: number; size: number }>,
    }

    const subdirs = ['avatars', 'music', 'storyboards', 'scripts', 'others']
    for (const dir of subdirs) {
      const dirPath = path.join(this.uploadDir, dir)
      if (!fs.existsSync(dirPath)) continue

      const files = fs.readdirSync(dirPath)
      let dirSize = 0

      for (const file of files) {
        const filePath = path.join(dirPath, file)
        const stat = fs.statSync(filePath)
        dirSize += stat.size
      }

      stats.byType[dir] = { count: files.length, size: dirSize }
      stats.totalFiles += files.length
      stats.totalSize += dirSize
    }

    return stats
  }
}
