import { PartialType } from '@nestjs/swagger';
import { CreateScriptDto, ScriptStatus } from './create-script.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateScriptDto extends PartialType(CreateScriptDto) {
  @ApiProperty({ description: '剧本状态', example: 'draft', enum: ScriptStatus, required: false })
  @IsEnum(ScriptStatus)
  @IsOptional()
  status?: ScriptStatus;
}
