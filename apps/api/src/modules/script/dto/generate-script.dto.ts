import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ScriptType } from './create-script.dto';

export class GenerateScriptDto {
  @ApiProperty({ description: '所属项目ID', example: 'uuid-string' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ description: '剧本主题/创意', example: '一个关于时间旅行的爱情故事' })
  @IsString()
  prompt: string;

  @ApiProperty({ description: '剧本类型', example: 'short', enum: ScriptType })
  @IsEnum(ScriptType)
  type: ScriptType;

  @ApiProperty({ description: '目标字数', example: 2000, required: false })
  @IsOptional()
  wordCount?: number;

  @ApiProperty({ description: '风格提示', example: '温馨治愈', required: false })
  @IsOptional()
  style?: string;
}
