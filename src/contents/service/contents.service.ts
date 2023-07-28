import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Content } from '../contents.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ContentsService {
  constructor(@InjectRepository(Content) private repo: Repository<Content>) {}

  async findByTopic(topic: string): Promise<Content[]> {
    const files = await this.repo.find({ where: { topic: topic } });
    return files;
  }
}
