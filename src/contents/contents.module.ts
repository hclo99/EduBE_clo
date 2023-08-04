import { Module } from '@nestjs/common';
import { ContentsService } from './service/contents.service';
import { ContentsController } from './controller/contents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entity/contents.entity';
import { Quiz } from './entity/quiz.entity';
import { Topic } from './entity/topic.entity';
import { ContentsGateway } from 'src/contents/service/contents.gateway';
import { LevelTopic } from './entity/level.topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Content, Topic, Quiz, LevelTopic])],
  providers: [ContentsService, ContentsGateway],
  controllers: [ContentsController],
})
export class ContentsModule {}
