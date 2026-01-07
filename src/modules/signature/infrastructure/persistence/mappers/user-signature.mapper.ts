import { UserSignatureEntity } from '../../../domain/entities/user-signature.entity';
import { UserSignatureOrmEntity } from '../orm/user-signature.orm-entity';
import { SignatureType } from '../../../domain/value-objects/signature-type.enum';

export class UserSignatureMapper {
  static toDomain(orm: UserSignatureOrmEntity): UserSignatureEntity {
    return UserSignatureEntity.create({
      id: orm.id,
      userId: orm.userId,
      type: orm.type as SignatureType,
      signatureImageBase64: orm.signatureImageBase64,
      publicKeyPem: orm.publicKeyPem,
      status: orm.status as any,
      createdAt: orm.createdAt,
      revokedAt: orm.revokedAt ?? null,
    });
  }

  static toOrm(entity: UserSignatureEntity): UserSignatureOrmEntity {
    const s = entity.snapshot;
    const orm = new UserSignatureOrmEntity();
    orm.id = s.id;
    orm.userId = s.userId;
    orm.type = s.type;
    orm.signatureImageBase64 = s.signatureImageBase64;
    orm.publicKeyPem = s.publicKeyPem;
    orm.status = s.status;
    orm.createdAt = s.createdAt;
    orm.revokedAt = s.revokedAt ?? null;
    return orm;
  }
}
