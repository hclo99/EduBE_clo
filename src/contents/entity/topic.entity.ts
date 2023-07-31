import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { Content } from './contents.entity';

@Entity({ name: 'Topic' })
export class Topic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @CreateDateColumn()
  created_at: Date;

  // Topic과 Quiz간 관계 설정
  @OneToMany(() => Quiz, (quiz) => quiz.topic)
  quizzes: Quiz[];

  // Topic과 Quiz간 관계 설정
  @OneToMany(() => Content, (content) => content.topic)
  contents: Content[];
}
