import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Topic } from './topic.entity';

@Entity({ name: 'File' })
export class Content {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { name: 'original_name', length: 200 })
  originalName: string;

  @Column('varchar', { length: 200 })
  name: string;

  @Column('int')
  length: number;

  @Column('varchar', { length: 200 })
  quality: string;

  @ManyToOne(() => Topic, (topic) => topic.id)
  @JoinColumn({ name: 'topicId' })
  topic: Topic;
}
