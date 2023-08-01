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

  private currentQuiz = 0;
  // quizzes 배열에서 + 1 로직.
  private quizzes: Quiz[] = [];

  @SubscribeMessage('startQuiz')
  async handleStartQuiz(
    @MessageBody() topicId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('io: ', topicId);
    const quizzes = await this.contentsService.findQuizzesByTopic(topicId); // quizzes 프로퍼티만 추출하여 할당
    this.quizzes = quizzes;
    client.emit('sendQuiz', this.quizzes);
  }
}

// 클라이언트: socket.on('sendQuiz', 퀴즈 배열 받아서 - )
// client.emit('quiz question', this.quizzes[this.currentQuiz].quiz);
// this.quizzes[0].quiz)가 클라이언트에게 전송되므로, currentQuiz를 +1씩 늘리거나 하는 로직 필요

/**
 * 영어 퀴즈를 시작하고, 사용자 답을 처리하며, 올바른 답이 제공되면 다음 퀴즈로 넘어간다.
 *
 * currentQuiz는 현재 진행 중인 퀴즈의 인덱스를 추적하는 데 사용됩니다.
 * 초기 값은 0으로 설정되어 있으며, 퀴즈가 진행되면서 사용자가 올바른 답을 제공하면 이 값이 증가합니다.
 *
 *
 */
