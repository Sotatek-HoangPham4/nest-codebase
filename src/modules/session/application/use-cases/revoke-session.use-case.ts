import { Injectable, Inject } from '@nestjs/common';
import type { ISessionRepository } from '../../domain/repositories/session.repository.interface';

@Injectable()
export class RevokeSessionUseCase {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.sessionRepo.revokeSession(id);
  }
}
