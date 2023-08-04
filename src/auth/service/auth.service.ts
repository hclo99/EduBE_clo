import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../auth.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
    private jwtService: JwtService,
  ) {}

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
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getUserLevel(userId: number): Promise<number> {
    const user = await this.repo.findOne({
      where: { id: userId },
    });

    return user.level;
  }
}
