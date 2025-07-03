import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //prefixe /api à toutes les routes
  app.setGlobalPrefix('api');
  // Pour autoriser le frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
