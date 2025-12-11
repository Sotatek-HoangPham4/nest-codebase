import { Injectable, Inject } from '@nestjs/common';
import type { ISessionRepository } from '../../domain/repositories/session.repository.interface';

@Injectable()
export class RevokeAllSessionsUseCase {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this.sessionRepo.revokeAllSessions(userId);
  }
}
