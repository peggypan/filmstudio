import { IsString, IsOptional, IsEnum, Length, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ScriptType {
  SHORT = 'short',
  LONG = 'long',
  EPISODE = 'episode',
}

export enum ScriptStatus {
  DRAFT = 'draft',
  REVIEWING = 'reviewing',
  FINALIZED = 'finalized',
}

export class CreateScriptDto {
  @ApiProperty({ description: '剧本标题', example: '初恋那件小事' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ description: '剧本内容', example: '第一幕：...', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '剧本类型', example: 'short', enum: ScriptType, required: false })
  @IsEnum(ScriptType)
  @IsOptional()
  type?: ScriptType;

  @ApiProperty({ description: '所属项目ID', example: 'uuid-string' })
  @IsUUID()
  projectId: string;
}
