import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../domain/entities/session.entity';
import type { ISessionRepository } from '../../domain/repositories/session.repository.interface';

@Injectable()
export class GetUserSessionsUseCase {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(userId: string): Promise<Session[]> {
    return this.sessionRepo.findByUserId(userId);
  }
}
