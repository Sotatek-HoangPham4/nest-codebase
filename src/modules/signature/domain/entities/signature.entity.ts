import { SignatureType } from '../value-objects/signature-type.enum';
import { IndexVO } from '../value-objects/index.vo';

export type SignatureStatus = 'PENDING' | 'SIGNED' | 'REVOKED';

export interface SignatureProps {
  id: string;
  documentId: string;
  signerId: string;

  type: SignatureType;
  index: IndexVO; // thứ tự ký

  // cryptographic fields
  publicKeyPem?: string;
  algorithm?: 'RSA' | 'ECDSA';
  signatureValueBase64?: string; // chữ ký số
  signedHashHex?: string; // hash tài liệu tại thời điểm ký
  timestampIso?: string; // tem thời gian
  qrPayload?: string; // payload để tạo QR

  // audit
  status: SignatureStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class SignatureEntity {
  private props: SignatureProps;

  private constructor(props: SignatureProps) {
    this.props = props;
  }

  static create(props: SignatureProps): SignatureEntity {
    // invariant cơ bản
    if (!props.documentId) throw new Error('documentId is required');
    if (!props.signerId) throw new Error('signerId is required');
    return new SignatureEntity(props);
  }

  markSigned(params: {
    signatureValueBase64: string;
    signedHashHex: string;
    publicKeyPem?: string;
    algorithm?: 'RSA' | 'ECDSA';
    timestampIso?: string;
    qrPayload?: string;
  }) {
    if (this.props.status === 'SIGNED') {
      throw new Error('Signature already signed');
    }
    this.props.signatureValueBase64 = params.signatureValueBase64;
    this.props.signedHashHex = params.signedHashHex;
    this.props.publicKeyPem = params.publicKeyPem;
    this.props.algorithm = params.algorithm;
    this.props.timestampIso = params.timestampIso;
    this.props.qrPayload = params.qrPayload;
    this.props.status = 'SIGNED';
    this.props.updatedAt = new Date();
  }

  revoke() {
    this.props.status = 'REVOKED';
    this.props.updatedAt = new Date();
  }

  get snapshot(): SignatureProps {
    return this.props;
  }
}
