import { SignatureType } from '../value-objects/signature-type.enum';

export type UserSignatureStatus = 'ACTIVE' | 'REVOKED';

export interface UserSignatureProps {
  id: string;
  userId: string;
  type: SignatureType;

  // DRAWN
  signatureImageBase64?: string;

  // DIGITAL
  publicKeyPem?: string;

  status: UserSignatureStatus;
  createdAt: Date;
  revokedAt?: Date | null;
}

export class UserSignatureEntity {
  private constructor(private props: UserSignatureProps) {}

  static create(props: UserSignatureProps) {
    if (!props.userId) throw new Error('userId is required');
    if (!props.id) throw new Error('id is required');
    return new UserSignatureEntity(props);
  }

  revoke() {
    if (this.props.status === 'REVOKED') return;
    this.props.status = 'REVOKED';
    this.props.revokedAt = new Date();
  }

  get snapshot(): UserSignatureProps {
    return this.props;
  }
}
