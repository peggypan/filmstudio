import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScriptModule } from './modules/script/script.module';
import { CastModule } from './modules/cast/cast.module';
import { MusicModule } from './modules/music/music.module';
import { StoryboardModule } from './modules/storyboard/storyboard.module';
import { DubbingModule } from './modules/dubbing/dubbing.module';
import { ProjectModule } from './modules/project/project.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    PrismaModule,
    AuthModule,
    ScriptModule,
    CastModule,
    MusicModule,
    StoryboardModule,
    DubbingModule,
    ProjectModule,
    FileModule,
  ],
})
export class AppModule {}
