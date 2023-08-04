import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Quiz } from 'src/contents/entity/quiz.entity';
import { ContentsService } from 'src/contents/service/contents.service';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class ContentsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private contentsService: ContentsService) {}

  private currentQuizIndex = 0; // quizzes 배열 인덱스

  @SubscribeMessage('startQuiz')
  async handleStartQuiz(
    @MessageBody() topicId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('io: ', topicId);

    const quizzes = await this.contentsService.findQuizzesByTopic(topicId);
    this.currentQuizIndex = 0; // 퀴즈 시작 시 인덱스 초기화
    this.sendQuiz(client, quizzes, topicId);
  }

  @SubscribeMessage('sendAnswer')
  async handleSendAnswer(
    @MessageBody() answerData: { quizId: number; isCorrect: boolean },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('Received answer: ', answerData);

    // $ User.matchedNum + 1 증가시킴
  }

  private sendQuiz(client: Socket, quizzes: Quiz[], topicId: number): void {
    if (this.currentQuizIndex < quizzes.length) {
      const quiz = quizzes[this.currentQuizIndex]; // 현재 인덱스의 퀴즈 선택
      console.log('quiz: ', quiz);
      client.emit('sendQuiz', quiz);
      this.currentQuizIndex++;
    } else {
      // 모든 퀴즈를 통과
      const message = `축하합니다, ${topicId} topic의 모든 퀴즈를 통과했습니다!`;
      client.emit('congratulations', message);

      // 새로운 topicId에 해당하는 다른 영상과 퀴즈 로드
      // this.topicId = await this.contentsService.findNextTopicId(this.topicId);
      // this.quizzes = await this.contentsService.findQuizzesByTopic(this.topicId);
      // this.currentQuizIndex = 0;
      // this.sendSequentialQuiz(client);
    }
  }
}
