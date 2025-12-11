import { Inject, Injectable } from '@nestjs/common';
import { CreateSessionDto } from '../dtos/create-session.dto';
import { Session } from '../../domain/entities/session.entity';
import type { ISessionRepository } from '../../domain/repositories/session.repository.interface';

@Injectable()
export class CreateSessionUseCase {
  constructor(
    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  async execute(dto: CreateSessionDto): Promise<Session> {
    const session = Session.create({
      ...dto,
      lastUsedAt: Date.now(),
    });
    return this.sessionRepo.create(session);
  }
}
