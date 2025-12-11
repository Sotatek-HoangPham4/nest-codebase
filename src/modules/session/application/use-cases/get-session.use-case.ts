import { Inject, Injectable } from '@nestjs/common';
import { Session } from '../../domain/entities/session.entity';
import type { ISessionRepository } from '../../domain/repositories/session.repository.interface';

@Injectable()
export class GetSessionUseCase {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(id: string): Promise<Session | null> {
    return this.sessionRepo.findById(id);
  }
}
