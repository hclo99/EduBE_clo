import { Module } from '@nestjs/common';
import { ContentsService } from './service/contents.service';
import { ContentsController } from './controller/contents.controller';

@Module({
  providers: [ContentsService],
  controllers: [ContentsController],
})
export class ContentsModule {}
