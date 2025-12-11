import { NestFactory } from '@nestjs/core';
import { SeedAppModule } from './seed-app.module';
import { SeedRunner } from './seed.runner';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedAppModule);

  const runner = app.get(SeedRunner);

  await runner.runAll();

  await app.close();
}

bootstrap();
