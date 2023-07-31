import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from './topic.entity';

@Entity({ name: 'Quiz' })
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  // Quiz와 Topic 관계 설정
  @ManyToOne(() => Topic, (topic) => topic.quizzes)
  @JoinColumn({ name: 'topicId' }) // 외래키 칼럼 이름. Quiz 테이블의 topic_id 칼럼은 Topic 테이블의 id 칼럼을 참조
  topic: Topic; // 프로퍼티 이름

  @Column({ type: 'varchar', length: 500, nullable: false })
  quiz: string;

  @Column('varchar', { array: true, length: 200, nullable: false })
  answerList: string[];

  @Column({ type: 'varchar', length: 200, nullable: false })
  answer: string;

  @CreateDateColumn()
  created_at: Date;
}
