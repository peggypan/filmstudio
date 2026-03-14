import { PartialType } from '@nestjs/swagger';
import { CreateDubbingDto, DubbingStatus } from './create-dubbing.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDubbingDto extends PartialType(CreateDubbingDto) {
  @ApiProperty({ description: '配音状态', example: 'pending', enum: DubbingStatus, required: false })
  @IsEnum(DubbingStatus)
  @IsOptional()
  status?: DubbingStatus;

  @ApiProperty({ description: '音频URL', example: 'https://example.com/audio.mp3', required: false })
  @IsOptional()
  audioUrl?: string;
}
