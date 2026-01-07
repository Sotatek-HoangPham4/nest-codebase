import { SignatureType } from '../../domain/value-objects/signature-type.enum';

export class UserSignatureResponseDto {
  id: string;
  userId: string;
  type: SignatureType;
  status: 'ACTIVE' | 'REVOKED';
  publicKeyPem?: string;
  signatureImageBase64?: string;
  createdAt: string;
  revokedAt?: string | null;
}
