import { Controller, Get, Query, Param } from '@nestjs/common';
import { ContentsService } from '../service/contents.service';

@Controller('contents')
export class ContentsController {
  constructor(private contentsService: ContentsService) {}

  @Get()
  async getFilesByTopic(@Query('topic') topic: string) {
    const files = await this.contentsService.findByTopic(topic);
    console.log('fr: ', topic, files);
    return files.map((file) => ({
      name: file.name,
      url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}_variant.m3u8`,
      thumbnailUrl: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}-view.m3u8`,
      length: file.length,
      sentence: file.sentence,
    }));
  }

  @Get('/:name')
  async getFileByName(@Param('name') name: string) {
    const file = await this.contentsService.findByName(name);
    const data = {
      name: file.name,
      originalName: file.originalName,
      url: `https://d1gvhezy2xavcm.cloudfront.net/${file.name}_variant.m3u8`,
      length: file.length,
      topic: file.topic,
      sentence: file.sentence,
    };
    console.log(data);
    return data;
  }
}
