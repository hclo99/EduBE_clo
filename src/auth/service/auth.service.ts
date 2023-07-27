import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth.entity';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(name: string, email: string, password: string, level: number) {
    const user = await this.repo.findOne({ where: { email } });
    if (user) {
      throw new NotFoundException('User already exists');
      return;
    } else {
      await this.repo.save({ name, email, password, level });
    }
  }

  async login(email: string, password: string) {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== password) {
      throw new NotFoundException('Wrong password');
    }
  }
}
