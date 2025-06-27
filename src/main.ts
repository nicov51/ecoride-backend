import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // console.log({
  //   POSTGRES_HOST: process.env.POSTGRES_HOST,
  //   POSTGRES_PORT: process.env.POSTGRES_PORT,
  //   POSTGRES_USER: process.env.POSTGRES_USER,
  //   POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  //   POSTGRES_DB: process.env.POSTGRES_DB,
  // });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
