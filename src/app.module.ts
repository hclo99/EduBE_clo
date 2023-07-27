import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigValidator } from '../config/db.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContentsModule } from './contents/contents.module';

@Module({
  imports: [TypeOrmModule.forRoot(ConfigValidator), AuthModule, ContentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
