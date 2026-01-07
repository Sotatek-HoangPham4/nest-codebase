import { SignatureEntity } from '../../../domain/entities/signature.entity';
import { SignatureOrmEntity } from '../orm/signature.orm-entity';
import { SignatureType } from '../../../domain/value-objects/signature-type.enum';
import { IndexVO } from '../../../domain/value-objects/index.vo';

export class SignatureMapper {
  static toDomain(orm: SignatureOrmEntity): SignatureEntity {
    return SignatureEntity.create({
      id: orm.id,
      documentId: orm.documentId,
      signerId: orm.signerId,
      type: orm.type as SignatureType,
      index: IndexVO.create(orm.index),
      publicKeyPem: orm.publicKeyPem,
      algorithm: orm.algorithm as any,
      signatureValueBase64: orm.signatureValueBase64,
      signedHashHex: orm.signedHashHex,
      timestampIso: orm.timestampIso,
      qrPayload: orm.qrPayload,
      status: orm.status as any,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: SignatureEntity): SignatureOrmEntity {
    const snap = entity.snapshot;
    const orm = new SignatureOrmEntity();
    orm.id = snap.id;
    orm.documentId = snap.documentId;
    orm.signerId = snap.signerId;
    orm.type = snap.type;
    orm.index = snap.index.get();
    orm.publicKeyPem = snap.publicKeyPem;
    orm.algorithm = snap.algorithm;
    orm.signatureValueBase64 = snap.signatureValueBase64;
    orm.signedHashHex = snap.signedHashHex;
    orm.timestampIso = snap.timestampIso;
    orm.qrPayload = snap.qrPayload;
    orm.status = snap.status;
    orm.createdAt = snap.createdAt;
    orm.updatedAt = snap.updatedAt;
    return orm;
  }
}
