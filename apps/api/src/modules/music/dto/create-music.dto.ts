import { IsString, IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum MusicStyle {
  HAPPY = 'happy',
  SAD = 'sad',
  EPIC = 'epic',
  ROMANTIC = 'romantic',
  TENSE = 'tense',
  RELAXED = 'relaxed',
  MYSTERIOUS = 'mysterious',
  ACTION = 'action',
}

export enum MusicLicense {
  FREE = 'free',
  CC = 'cc',
  ROYALTY_FREE = 'royalty_free',
  COMMERCIAL = 'commercial',
}

export class CreateMusicDto {
  @ApiProperty({ description: '音乐名称', example: '温暖阳光' })
  @IsString()
  name: string;

  @ApiProperty({ description: '音乐风格', example: 'happy', enum: MusicStyle })
  @IsEnum(MusicStyle)
  style: MusicStyle;

  @ApiProperty({ description: '时长(秒)', example: 180 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ description: '许可证类型', example: 'free', enum: MusicLicense })
  @IsEnum(MusicLicense)
  license: MusicLicense;

  @ApiProperty({ description: '音频URL', example: 'https://example.com/music.mp3' })
  @IsString()
  url: string;

  @ApiProperty({ description: '所属项目ID(可选)', example: 'uuid-string', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;
}
