import { IsString, IsOptional, IsEnum, Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CastType {
  ACTOR = 'actor',
  DIRECTOR = 'director',
  PRODUCER = 'producer',
  CREW = 'crew',
  OTHER = 'other',
}

export class CreateCastDto {
  @ApiProperty({ description: '演员姓名', example: '张三' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: '角色类型', example: 'actor', enum: CastType })
  @IsEnum(CastType)
  type: CastType;

  @ApiProperty({ description: '联系方式', example: 'zhangsan@example.com', required: false })
  @IsOptional()
  contact?: string;

  @ApiProperty({ description: '头像URL', example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: '个人简介', example: '资深演员，擅长喜剧表演', required: false })
  @IsOptional()
  bio?: string;
}
