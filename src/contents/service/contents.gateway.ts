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

@WebSocketGateway({ cors: true, transports: ['websocket'] }) // { cors: true, transports: ['websocket'] }
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
 * 인터페이스는 특정 객체가 어떤 프로퍼티와 메서드를 가져야 하는지 정의하는 계약 같은 것입니다. 클래스가 인터페이스를 implements하면, 해당 클래스는 인터페이스에 정의된 모든 프로퍼티와 메서드를 반드시 구현해야 합니다.

예를 들어, OnGatewayConnection와 OnGatewayDisconnect 인터페이스를 살펴보면, 
Nest.js 웹소켓 모듈에서 정의된 인터페이스로서, 각각 연결 및 연결 해제 시점에 호출되어야 하는 메서드를 정의합니다.

OnGatewayConnection: 이 인터페이스를 구현하는 클래스는 handleConnection 
메서드를 반드시 정의해야 하며, 클라이언트가 서버에 연결되었을 때 호출됩니다.

OnGatewayDisconnect: 이 인터페이스를 구현하는 클래스는 handleDisconnect 
메서드를 반드시 정의해야 하며, 클라이언트가 서버와의 연결을 끊었을 때 호출됩니다.
EnglishQuizGateway 클래스에서 이 두 인터페이스를 implements하므로, 해당 클래스는 이 두 메서드를 반드시 포함해야 하고, 연결 및 연결 해제 시점에 자동으로 호출됩니다.
 * 
 * 
 * 영어 퀴즈를 시작하고, 사용자 답을 처리하며, 올바른 답이 제공되면 다음 퀴즈로 넘어간다. 
 * 
 * currentQuiz는 현재 진행 중인 퀴즈의 인덱스를 추적하는 데 사용됩니다. 
 * 초기 값은 0으로 설정되어 있으며, 퀴즈가 진행되면서 사용자가 올바른 답을 제공하면 이 값이 증가합니다.
 * 
 * 
 */
