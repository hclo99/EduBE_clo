import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ContentsModule } from './contents/contents.module';

@Module({
  imports: [AuthModule, ContentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
