import { Controller, Get, Query, Param } from '@nestjs/common';
import { ContentsService } from '../service/contents.service';
import { Content } from '../entity/contents.entity';

@Controller('contents')
export class ContentsController {
  constructor(private contentsService: ContentsService) {}

  @Get()
  async getAllFiles() {
    const files = await this.contentsService.findAllFiles();
    return files.map(({ file, quiz }) => {
      return {
        name: file.name,
        url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}_variant.m3u8`,
        thumbnailUrl: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}-view.m3u8`,
        length: file.length,
        quiz: quiz.quiz,
      };
    });
  }

  @Get()
  async getFilesByTopic(@Query('topic') topicId: number) {
    const files = await this.contentsService.findByTopic(topicId);
    return files.map(({ file, quiz }) => {
      // (quiz as any).topic = quiz.topic.name;
      const newQuiz = {
        ...quiz, // 복사
        topic: quiz.topic.name,
      };
      return {
        name: file.name,
        url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}_variant.m3u8`,
        thumbnailUrl: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}-view.m3u8`,
        length: file.length,
        quiz: newQuiz,
      };
    });
  }

  @Get('/quiz/:topic')
  async getQuizzesByTopic(@Param('topic') topicId: number) {
    const quizzes = await this.contentsService.findQuizzesByTopic(topicId);
    // const data = quizzes.map((quiz) => ({
    //   topic: topicName,
    //   quiz: quiz.quiz,
    //   answerList: quiz.answerList,
    //   answer: quiz.answer,
    // }));

    return quizzes;
  }

  @Get('/:name')
  async getFileByName(@Param('name') name: string) {
    const file = await this.contentsService.findByName(name);
    // console.log('fr: get/:name', file);
    const data = {
      name: file.name,
      originalName: file.originalName,
      url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}_variant.m3u8`,
      length: file.length,
      topic_id: file.topic.id,
    };
    return data;
  }
}
