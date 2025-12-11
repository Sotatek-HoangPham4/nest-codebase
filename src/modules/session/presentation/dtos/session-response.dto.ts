import { Session } from '../../domain/entities/session.entity';

export class SessionResponseDto {
  static toResponse(entity: Session) {
    return {
      id: entity.id,
      userId: entity.userId,
      device: entity.device,
      ipAddress: entity.ipAddress,
      userAgent: entity.userAgent,
      isRevoked: entity.isRevoked,
      lastUsedAt: entity.lastUsedAt,
      createdAt: entity.createdAt?.toISOString?.() ?? entity.createdAt,
      updatedAt: entity.updatedAt?.toISOString?.() ?? entity.updatedAt,
    };
  }
}
