import { Inject, Injectable } from '@nestjs/common';
import {
  USER_SIGNATURE_REPOSITORY,
  type UserSignatureRepositoryInterface,
} from '../../domain/repositories/user-signature.repository.interface';
import { UserSignatureResponseDto } from '../dtos/user-signature-response.dto';

@Injectable()
export class GetUserSignatureUseCase {
  constructor(
    @Inject(USER_SIGNATURE_REPOSITORY)
    private readonly repo: UserSignatureRepositoryInterface,
  ) {}

  async execute(userId: string): Promise<UserSignatureResponseDto | null> {
    const active = await this.repo.findActiveByUserId(userId);
    if (!active) return null;

    const s = active.snapshot;
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
