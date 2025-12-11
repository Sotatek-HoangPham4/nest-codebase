import { Session } from '../../../domain/entities/session.entity';
import { SessionOrmEntity } from '../orm/session.orm-entity';

export class SessionMapper {
  static toDomain(record: SessionOrmEntity): Session {
    return new Session({
      id: record.id,
      userId: record.userId,
      device: record.device,
      ipAddress: record.ipAddress,
      userAgent: record.userAgent,
      refreshTokenHash: record.refreshTokenHash,
      isRevoked: record.isRevoked,
      lastUsedAt: record.lastUsedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  static toOrm(entity: Session): Partial<SessionOrmEntity> {
    return entity.getProps();
  }
}
