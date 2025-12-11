import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ISessionRepository } from '@/modules/session/domain/repositories/session.repository.interface';

@Injectable()
export class LogoutUseCase {
  private readonly logger = new Logger(LogoutUseCase.name);

  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(sessionId: string): Promise<void> {
    await this.sessionRepo.revokeSession(sessionId);
    this.logger.log(`Revoked session ${sessionId}`);
  }
}
