import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ContentsService } from '../service/contents.service';
import { AuthService } from 'src/auth/service/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('contents')
export class ContentsController {
  constructor(
    private contentsService: ContentsService,
    private authService: AuthService,
  ) {}

  @Get()
  async getAllFiles() {
    const files = await this.contentsService.findAllFiles();
    return files
      .map(({ file, quiz }) => {
        return {
          id: file.id,
          name: file.name,
          url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}_variant.m3u8`,
          thumbnailUrl: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}-view.m3u8`,
          length: file.length,
          quiz: quiz.quiz,
        };
      })
      .sort((a, b) => b.id - a.id);
  }

  // 헤더 토큰 Id를 읽어서 level별 토픽 및 영상 전송
  // @UseGuards(AuthGuard)
  @Get('/level/:level')
  async getFilesByUserLevel(@Param('level') level: number) {
    // const userId = req.user.sub; // AuthGuard를 통해 얻은 사용자 ID
    // const level = await this.authService.getUserLevel(userId);
    const topicIds = await this.contentsService.findTopicsByLevel(level);
    console.log('fr: ', topicIds);

    const result = [];

    for (const topicId of topicIds) {
      const items = await this.contentsService.findFilesByTopic(topicId);
      const data = items.files
        .map(({ file, quiz }) => {
          if (!quiz) {
            return null;
          }

          const newQuiz = {
            ...quiz,
            topic: quiz.topic.name,
          };
          return {
            name: file.name,
            url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}_variant.m3u8`,
            thumbnailUrl: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}-view.m3u8`,
            length: file.length,
            quiz: newQuiz.quiz,
          };
        })
        .filter((item) => item); // null값 제거

      if (data.length > 0) {
        result.push({ topicId: items.topicId, name: items.name, files: data });
      }
    }
    console.log('fr: result: ', result);
    return result;
  }

  @Get('/quiz/:topic')
  async getQuizzesByTopic(@Param('topic') topicId: number) {
    const quizzes = await this.contentsService.findQuizzesByTopic(topicId);

    return quizzes;
  }

  @Get('/:name')
  async getFileByName(@Param('name') name: string) {
    const file = await this.contentsService.findFileByName(name);
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
