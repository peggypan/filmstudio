import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { ScriptModule } from './modules/script/script.module';
import { CastModule } from './modules/cast/cast.module';
import { MusicModule } from './modules/music/music.module';
import { StoryboardModule } from './modules/storyboard/storyboard.module';
import { DubbingModule } from './modules/dubbing/dubbing.module';
import { ProjectModule } from './modules/project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ScriptModule,
    CastModule,
    MusicModule,
    StoryboardModule,
    DubbingModule,
    ProjectModule,
  ],
})
export class AppModule {}
