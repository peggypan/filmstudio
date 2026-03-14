import { Module } from '@nestjs/common';
import { DubbingController } from './dubbing.controller';
import { DubbingService } from './dubbing.service';

@Module({
  controllers: [DubbingController],
  providers: [DubbingService],
  exports: [DubbingService],
})
export class DubbingModule {}
