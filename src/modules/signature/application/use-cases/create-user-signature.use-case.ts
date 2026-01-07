import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  USER_SIGNATURE_REPOSITORY,
  type UserSignatureRepositoryInterface,
} from '../../domain/repositories/user-signature.repository.interface';
import { UserSignatureEntity } from '../../domain/entities/user-signature.entity';
import { CreateUserSignatureDto } from '../dtos/create-user-signature.dto';
import { UserSignatureResponseDto } from '../dtos/user-signature-response.dto';
import { SignatureType } from '../../domain/value-objects/signature-type.enum';

@Injectable()
export class CreateUserSignatureUseCase {
  constructor(
    @Inject(USER_SIGNATURE_REPOSITORY)
    private readonly repo: UserSignatureRepositoryInterface,
  ) {}

  async execute(
    dto: CreateUserSignatureDto,
    userId: string,
  ): Promise<UserSignatureResponseDto> {
    const existing = await this.repo.findActiveByUserId(userId);
    if (existing)
      throw new Error('User already has an active signature. Use recreate.');

    // validate by type
    if (dto.type === SignatureType.DRAWN && !dto.signatureImageBase64) {
      throw new Error('signatureImageBase64 is required for DRAWN');
    }
    if (dto.type === SignatureType.DIGITAL && !dto.publicKeyPem) {
      throw new Error('publicKeyPem is required for DIGITAL');
    }

    const now = new Date();
    const entity = UserSignatureEntity.create({
      id: randomUUID(),
      userId: userId,
      type: dto.type,
      signatureImageBase64: dto.signatureImageBase64,
      publicKeyPem: dto.publicKeyPem,
      status: 'ACTIVE',
      createdAt: now,
      revokedAt: null,
    });

    const saved = await this.repo.create(entity);
    const s = saved.snapshot;

    return {
      id: s.id,
      userId: s.userId,
      type: s.type,
      status: s.status,
      publicKeyPem: s.publicKeyPem,
      signatureImageBase64: s.signatureImageBase64,
      createdAt: s.createdAt.toISOString(),
      revokedAt: s.revokedAt ? s.revokedAt.toISOString() : null,
    };
  }
}
