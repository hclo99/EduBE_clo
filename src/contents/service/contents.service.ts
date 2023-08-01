import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../entity/contents.entity';
import { Repository } from 'typeorm';
import { Quiz } from '../entity/quiz.entity';
import { Topic } from '../entity/topic.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Topic) private topicRepo: Repository<Topic>,
  ) {}

  async findAllFiles(): Promise<{ file: Content; quiz: Quiz }[]> {
    const files = await this.contentRepo.find();
    const quizzes = await this.quizRepo.find();

    return files.map((file) => {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      return { file, quiz: randomQuiz };
    });
  }

  async findByTopic(topicId: number): Promise<{ file: Content; quiz: Quiz }[]> {
    const files = await this.contentRepo.find({
      where: { topic: { id: topicId } },
    });
    // console.log('hi1');
    // const topic = await this.topicRepo.findOne({ where: { id: topicId } });
    // console.log('hi2');
    const quizzes = await this.findQuizzesByTopic(topicId);
    // console.log('hi3');
    return files.map((file) => {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      return { file, quiz: randomQuiz };
    });
  }

  async findByName(name: string): Promise<Content> {
    const file = await this.contentRepo.findOne({
      where: { name: name },
      relations: ['topic'],
    });
    return file;
  }

  // Topic에 대한 퀴즈 생성
  async findQuizzesByTopic(topicId: number): Promise<Quiz[]> {
    // Quiz 테이블) 해당 Topic id로 모든 Quiz 찾기
    const quizzes = await this.quizRepo.find({
      where: { topic: { id: topicId } },
      relations: ['topic'],
    });

    return quizzes;
  }
}
