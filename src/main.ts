import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// 5) დაადეთ ფილტრები ორივე მიდლვეარს მაგალითად, სერჩი სახელის მიხედვით,
// ჟანრის მიხედვით, წელი და ა.შ. მაგალითად: /movies?genre=comedy&yearFrom=2002&yearTo=2010&name=hang
