import { IsString, IsOptional, IsInt, Min, Max, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: '项目名称', example: '我的第一个短片' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: '项目描述', example: '这是一个关于...的短片', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;

  @ApiProperty({ description: '项目状态', example: 'active', required: false, enum: ['active', 'paused', 'completed', 'archived'] })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: '项目进度', example: 0, required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  progress?: number;
}
