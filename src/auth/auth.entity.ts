import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'User' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column({ type: 'varchar', name: 'name', length: 20, default: '' })
  name?: string;

  @Column({ type: 'varchar', name: 'email', unique: true, length: 30 })
  email: string;

  @Column({ type: 'varchar', name: 'password', length: 30 })
  password: string;

  @Column({ type: 'int', name: 'level' })
  level: number;

  @Column({ type: 'int', name: 'matchedNum' })
  matchedNum: number;
}
