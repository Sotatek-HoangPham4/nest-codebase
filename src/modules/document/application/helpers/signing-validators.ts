import { ForbiddenException, BadRequestException } from '@nestjs/common';
import {
  getSigningMetadata,
  SigningMetadata,
} from '../../domain/types/document-signing.types';

export function requireSigningMetadata(metadata: any): SigningMetadata {
  const signing = getSigningMetadata(metadata);
  if (!signing) throw new BadRequestException('metadata.signing is required');
  return signing;
}

export function ensureOwnerOrEditor(signing: SigningMetadata, actorId: string) {
  const { ownerId, permissions } = signing.participants;
  if (actorId === ownerId) return;
  if (permissions.editors?.includes(actorId)) return;
  throw new ForbiddenException('No permission');
}

export function validateSetup(signing: SigningMetadata) {
  const signers = signing.participants?.signers ?? [];
  if (!signers.length)
    throw new BadRequestException('At least 1 signer is required');

  const indices = signers.map((s) => s.index);
  const unique = new Set(indices);
  if (unique.size !== indices.length)
    throw new BadRequestException('Signer index duplicated');

  const placements = signing.placements ?? [];
  for (const p of placements) {
    const exists = signers.some(
      (s) => s.userId === p.signerId && s.index === p.index,
    );
    if (!exists)
      throw new BadRequestException(
        `Placement signer/index invalid: ${p.placementId}`,
      );
    if (p.page < 1)
      throw new BadRequestException(`Placement page invalid: ${p.placementId}`);
  }
}
