import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 페이로드와 DTO 클래스를 비교해 수신해서는 안되는 속성을 자동으로 제거하는 옵션(유효성이 검사된 객체만 수신)
    }),
  );
  app.enableCors();

  await app.listen(8000);
}

bootstrap();
