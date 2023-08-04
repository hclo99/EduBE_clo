import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from './topic.entity';

@Entity({ name: 'LevelTopic' })
export class LevelTopic {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int' })
  level: number;

  @ManyToOne(() => Topic)
  @JoinColumn({ name: 'topicId' })
  topic: Topic;
}
