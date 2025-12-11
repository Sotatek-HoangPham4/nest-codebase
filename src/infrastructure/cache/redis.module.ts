import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule as IoRedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    IoRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redis = configService.get('redis');
        return {
          type: 'single',
          url: `redis://:123456789@127.0.0.1:6379/0`,
        };
      },
    }),
  ],
  exports: [IoRedisModule],
})
export class RedisModule {}
