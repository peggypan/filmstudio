import { IsString, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DubbingStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class CreateDubbingDto {
  @ApiProperty({ description: '配音名称', example: '主角台词-第一幕' })
  @IsString()
  name: string;

  @ApiProperty({ description: '配音文本', example: '今天真是美好的一天' })
  @IsString()
  text: string;

  @ApiProperty({ description: '声音ID', example: 'voice_001', required: false })
  @IsOptional()
  voiceId?: string;

  @ApiProperty({ description: '所属项目ID', example: 'uuid-string' })
  @IsUUID()
  projectId: string;
}
