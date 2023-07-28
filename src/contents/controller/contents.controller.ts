import { Controller, Get, Query } from '@nestjs/common';
import { ContentsService } from '../service/contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private contentsService: ContentsService) {}

  @Get()
  async getFilesByTopic(@Query('topic') topic: string) {
    const files = await this.contentsService.findByTopic(topic);
    console.log('fr:', topic, files);
    return files.map((file) => ({
      name: file.name,
      url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}.m3u8`,
      length: file.length,
      sentence: file.sentence,
    }));
  }
}
