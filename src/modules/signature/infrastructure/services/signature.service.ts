import { Injectable } from '@nestjs/common';
import { CryptoSignService } from './crypto-sign.service';
import { TimestampService } from './timestamp.service';
import { QrService } from './qr.service';
import { PdfSignService } from './pdf-sign.service';

export type SupportedAlgorithm = 'RSA' | 'ECDSA';
export type UserSignatureType = 'DRAWN' | 'DIGITAL';

@Injectable()
export class SignatureService {
  constructor(
    private readonly crypto: CryptoSignService,
    private readonly timestamp: TimestampService,
    private readonly qr: QrService,
    private readonly pdf: PdfSignService,
  ) {}

  // ===== NEW API (recommended) =====
  async signPdf(params: {
    pdfBuffer: Buffer;
    documentId: string;
    signatureId: string;
    signerId: string;
    index: number;

    userSignatureType: 'DRAWN' | 'DIGITAL';
    signatureImageBase64?: string;

    algorithm: 'RSA' | 'ECDSA';
    privateKeyPem: string;
    publicKeyPem?: string;
  }) {
    const hashHex = this.crypto.hashSha256(params.pdfBuffer);

    const signatureValueBase64 = this.crypto.signHashHex({
      hashHex,
      privateKeyPem: params.privateKeyPem,
      algorithm: params.algorithm,
    });

    const timestampIso = this.timestamp.nowIso();

    const qrPayload = this.qr.buildPayload({
      documentId: params.documentId,
      signatureId: params.signatureId,
      hashHex,
      timestampIso,
    });

    const signedPdfBuffer = await this.pdf.attachSignatureInfo({
      pdfBuffer: params.pdfBuffer,
      documentId: params.documentId,
      signatureId: params.signatureId,
      signerId: params.signerId,
      index: params.index,
      hashHex,
      timestampIso,
      qrPayload,
      userSignatureType: params.userSignatureType,
      signatureImageBase64: params.signatureImageBase64,
    });

    return {
      hashHex,
      signatureValueBase64,
      timestampIso,
      qrPayload,
      signedPdfBuffer,
    };
  }

  verify(params: {
    pdfBuffer: Buffer;
    expectedHashHex: string;
    signatureValueBase64?: string | null;
    publicKeyPem?: string | null;
    algorithm?: 'RSA' | 'ECDSA' | null;
  }) {
    const computedHashHex = this.crypto.hashSha256(params.pdfBuffer);
    const hashMatch = computedHashHex === params.expectedHashHex;

    if (!hashMatch) {
      return {
        ok: false,
        computedHashHex,
        expectedHashHex: params.expectedHashHex,
        reason: 'Hash mismatch',
      };
    }

    if (
      !params.publicKeyPem ||
      !params.signatureValueBase64 ||
      !params.algorithm
    ) {
      // MVP: hash ok là pass
      return {
        ok: true,
        computedHashHex,
        expectedHashHex: params.expectedHashHex,
        note: 'Hash only',
      };
    }

    const cryptoOk = this.crypto.verifyHashHex({
      hashHex: params.expectedHashHex,
      signatureValueBase64: params.signatureValueBase64,
      publicKeyPem: params.publicKeyPem,
      algorithm: params.algorithm,
    });

    return {
      ok: cryptoOk,
      computedHashHex,
      expectedHashHex: params.expectedHashHex,
      reason: cryptoOk ? undefined : 'Crypto verify failed',
    };
  }

  // ===== BACKWARD COMPAT (fix compile immediately) =====
  // alias for old calls in use-cases
  async signDocument(args: {
    pdfBuffer: Buffer;
    documentId: string;
    signatureId: string;
    signerId: string;
    index: number;

    userSignatureType: 'DRAWN' | 'DIGITAL';
    signatureImageBase64?: string;

    algorithm: 'RSA' | 'ECDSA';
    privateKeyPem: string;
    publicKeyPem?: string;
  }) {
    return this.signPdf(args);
  }

  verifySignature(args: {
    pdfBuffer: Buffer;
    signatureValueBase64?: string | null;
    publicKeyPem?: string | null;
    algorithm?: 'RSA' | 'ECDSA' | null;
    expectedHashHex: string;
  }) {
    return this.verify(args);
  }
}
