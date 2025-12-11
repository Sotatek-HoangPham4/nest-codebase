import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@/infrastructure/database/database.module';
import { SeedModule } from './seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [], // nếu cần load thêm config cho seed
    }),

    DatabaseModule,

    SeedModule, // chứa SeedRunner
  ],
})
export class SeedAppModule {}
