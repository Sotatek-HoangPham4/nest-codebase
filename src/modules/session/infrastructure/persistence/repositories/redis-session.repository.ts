import { ISessionCacheRepository } from '@/modules/session/domain/repositories/session-cache.repository.interface';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import type { Redis } from 'ioredis';

@Injectable()
export class RedisSessionRepository implements ISessionCacheRepository {
  private readonly prefix = 'session:';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async create(sessionId: string, data: any, ttlMs: number) {
    await this.redis.set(
      this.prefix + sessionId,
      JSON.stringify(data),
      'PX',
      ttlMs,
    );
  }

  async find(sessionId: string) {
    const raw = await this.redis.get(this.prefix + sessionId);
    return raw ? JSON.parse(raw) : null;
  }

  async update(sessionId: string, data: any, ttlMs: number) {
    await this.redis.set(
      this.prefix + sessionId,
      JSON.stringify(data),
      'PX',
      ttlMs,
    );
  }

  async revoke(sessionId: string) {
    await this.redis.del(this.prefix + sessionId);
  }
}
