import { Module } from '@nestjs/common';
import { ContentsService } from './service/contents.service';
import { ContentsController } from './controller/contents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './contents.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content])],
  providers: [ContentsService],
  controllers: [ContentsController],
})
export class ContentsModule {}
