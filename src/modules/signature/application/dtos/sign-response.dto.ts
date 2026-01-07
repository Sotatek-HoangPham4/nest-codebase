import { SignatureType } from '../../domain/value-objects/signature-type.enum';

export class SignResponseDto {
  signatureId: string;
  documentId: string;
  signerId: string;

  type: SignatureType;
  index: number;

  signedPdfBase64?: string; // nếu use-case trả về bản đã “đóng dấu”
  signedHashHex: string;
  timestampIso?: string;
  qrPayload?: string;
}
