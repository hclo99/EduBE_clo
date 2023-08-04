import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../entity/contents.entity';
import { Repository } from 'typeorm';
import { Quiz } from '../entity/quiz.entity';
import { Topic } from '../entity/topic.entity';
import { LevelTopic } from '../entity/level.topic.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content) private contentRepo: Repository<Content>,
    @InjectRepository(Quiz) private quizRepo: Repository<Quiz>,
    @InjectRepository(Topic) private topicRepo: Repository<Topic>,
    @InjectRepository(LevelTopic) private levelRepo: Repository<LevelTopic>,
  ) {}

  async findAllFiles(): Promise<{ file: Content; quiz: Quiz }[]> {
    const files = await this.contentRepo.find({ where: { quality: 'view' } });
    const quizzes = await this.quizRepo.find();

    return files.map((file) => {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      return { file, quiz: randomQuiz };
    });
  }

  // 1. 특정 level에 속하는 topicId 배열
  async findTopicsByLevel(level: number): Promise<number[]> {
    const levelTopics = await this.levelRepo.find({
      where: { level: level },
      relations: ['topic'],
    });
    // console.log(levelTopics);
    const topicIds = levelTopics.map((levelTopic) => levelTopic.topic.id);
    return topicIds;
  }

  // 2. 특정 topicId에 대한 Content 및 Quiz
  async findFilesByTopic(topicId: number): Promise<{
    topicId: number;
    name: string;
    files: { file: Content; quiz: Quiz }[];
  }> {
    const files = await this.contentRepo.find({
      where: { topic: { id: topicId } },
    });
    const topic = await this.topicRepo.findOne({ where: { id: topicId } });
    const quizzes = await this.findQuizzesByTopic(topicId);

    const fileObjects = files.map((file) => {
      const randomQuiz = quizzes[Math.floor(Math.random() * quizzes.length)];
      return { file, quiz: randomQuiz };
    });

    console.log('fr: topicId: ', topicId, fileObjects);
    return {
      topicId: topicId,
      name: topic.name,
      files: fileObjects,
    };
  }

  async findFileByName(name: string): Promise<Content> {
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
