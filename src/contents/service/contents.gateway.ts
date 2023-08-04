import { InjectRepository } from '@nestjs/typeorm';
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
import { Topic } from '../entity/topic.entity';
import { Repository } from 'typeorm';
import { User } from 'src/auth/auth.entity';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class ContentsGateway {
  @WebSocketServer()
  server: Server;

  @InjectRepository(Topic) private topicRepo: Repository<Topic>;
  @InjectRepository(User) private userRepo: Repository<User>;

  constructor(private contentsService: ContentsService) {}

  private currentQuizIndex = new Map<string, number>(); // quizzes 배열 인덱스
  private clientQuizzes = new Map<string, Quiz[]>(); // quizzes 배열 자체
  private clientTopics = new Map<string, number>(); // 클라이언트 별 topicId 저장

  @SubscribeMessage('startQuiz')
  async handleStartQuiz(
    @MessageBody() topicId: number,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('io: ', topicId);

    const quizzes = await this.contentsService.findQuizzesByTopic(topicId);
    console.log('fr: quizzes: ', quizzes);
    this.clientQuizzes.set(client.id, quizzes); // 클라이언트 ID에 대한 퀴즈 배열 저장
    this.currentQuizIndex.set(client.id, 0);
    this.clientTopics.set(client.id, topicId);
    this.sendQuiz(client, topicId);
  }

  @SubscribeMessage('sendAnswer')
  async handleSendAnswer(
    @MessageBody() answerData: { quizId: number; isCorrect: boolean },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    console.log('Received answer: ', answerData);

    const quizzes = this.clientQuizzes.get(client.id); // 클라이언트 ID에 해당하는 퀴즈 배열 가져오기
    const topicId = this.clientTopics.get(client.id);
    /* 레벨 업그레이드 */

    if (quizzes) {
      this.sendQuiz(client, topicId);

      await this.userRepo.manager.transaction(
        async (transactionalEntityManager) => {
          const user = await transactionalEntityManager.findOne(User, {
            where: { id: 1 },
          });

          /* 정답 맞추면 */
          if (answerData.isCorrect) {
            user.matchedNum += 1;
            console.log('맞춘 개수: ', user.matchedNum);

            // 맞춘 개수가 5 이상이면 level2, 10 이상이면 level 3
            if (user.matchedNum == 5) {
              client.emit(
                'levelUp',
                '고객님의 레벨이 Level 2로 업그레이드 되었습니다, 축하합니다!',
              );
              user.level = 2;
            } else if (user.matchedNum == 10) {
              client.emit(
                'levelUp',
                '고객님의 레벨이 Level 3로 업그레이드 되었습니다, 축하합니다!',
              );
              user.level = 2;
            }
          } else {
            user.matchedNum -= 1;
          }
          // await this.userRepo.save(user);
          await transactionalEntityManager.save(User, user);
        },
      );
    }
  }

  private async sendQuiz(client: Socket, topicId: number): Promise<void> {
    const quizzes = this.clientQuizzes.get(client.id);
    const index = this.currentQuizIndex.get(client.id) || 0;
    const topic = await this.topicRepo.findOne({ where: { id: topicId } });

    if (quizzes && index < quizzes.length) {
      const quiz = quizzes[index]; // 현재 인덱스의 퀴즈 선택
      console.log('fr: quiz: ', quiz);

      client.emit('sendQuiz', quiz);
      this.currentQuizIndex.set(client.id, index + 1);
    } else {
      // 모든 퀴즈를 통과
      const message = `축하합니다, topic [${topic.name}]의 모든 퀴즈를 통과했습니다!`;
      client.emit('congratulations', message);
    }
  }
}
