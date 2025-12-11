import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { SessionOrmEntity } from '../orm/session.orm-entity';

import { Injectable } from '@nestjs/common';
import { SessionMapper } from '../mappers/session.mapper';
import { Session } from '@/modules/session/domain/entities/session.entity';
import { ISessionRepository } from '@/modules/session/domain/repositories/session.repository.interface';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionOrmEntity)
    private readonly repo: Repository<SessionOrmEntity>,
  ) {}

  async create(session: Session): Promise<Session> {
    const saved = await this.repo.save(SessionMapper.toOrm(session));
    return SessionMapper.toDomain(saved as SessionOrmEntity);
  }

  async findById(id: string): Promise<Session | null> {
    const session = await this.repo.findOne({ where: { id } });
    return session ? SessionMapper.toDomain(session) : null;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    const sessions = await this.repo.find({ where: { userId } });
    return sessions.map(SessionMapper.toDomain);
  }

  async update(session: Session): Promise<Session> {
    const saved = await this.repo.save(SessionMapper.toOrm(session));
    return SessionMapper.toDomain(saved as SessionOrmEntity);
  }

  async revokeSession(id: string): Promise<void> {
    await this.repo.update(id, { isRevoked: true });
  }

  async revokeAllExcept(currentId: string, userId: string): Promise<void> {
    await this.repo.update({ userId, id: Not(currentId) }, { isRevoked: true });
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.repo.update({ userId }, { isRevoked: true });
  }

  async findByIdAndUser(id: string, userId: string): Promise<Session | null> {
    const session = await this.repo.findOne({ where: { id, userId } });
    return session ? SessionMapper.toDomain(session) : null;
  }

  async findActiveById(id: string): Promise<Session | null> {
    const session = await this.repo.findOne({
      where: { id, isRevoked: false },
    });
    return session ? SessionMapper.toDomain(session) : null;
  }
}
