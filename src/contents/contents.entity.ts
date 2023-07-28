import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column('varchar', { length: 255 })
  topic: string;

  @Column('text')
  sentence: string;
}
