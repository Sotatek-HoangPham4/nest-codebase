import { Inject, Injectable } from '@nestjs/common';
import {
  SIGNATURE_REPOSITORY,
  type SignatureRepositoryInterface,
} from '../../domain/repositories/signature.repository.interface';
import { SignatureService } from '../../infrastructure/services/signature.service';
import { VerifyRequestDto } from '../dtos/verify-request.dto';

@Injectable()
export class VerifySignatureUseCase {
  constructor(
    @Inject(SIGNATURE_REPOSITORY)
    private readonly repo: SignatureRepositoryInterface,
    private readonly signatureService: SignatureService,
  ) {}

  async execute(dto: VerifyRequestDto): Promise<{
    ok: boolean;
    details: Array<{
      signatureId: string;
      signerId: string;
      index: number;
      ok: boolean;
      computedHashHex: string;
      expectedHashHex?: string;
    }>;
  }> {
    if (!dto.pdfBase64)
      throw new Error('pdfBase64 is required for verify demo');
    const pdfBuffer = Buffer.from(dto.pdfBase64, 'base64');

    const signedList = await this.repo.findSignedByDocumentId(dto.documentId);

    const details = signedList
      .map((sig) => {
        const snap = sig.snapshot;
        if (!snap.signatureValueBase64) return null;
        if (!snap.publicKeyPem) {
          // Nếu bạn không lưu publicKey thì verify theo hash+log khác (hoặc CA)
          // Ở đây coi như fail.
          return {
            signatureId: snap.id,
            signerId: snap.signerId,
            index: snap.index.get(),
            ok: false,
            computedHashHex: 'N/A',
            expectedHashHex: snap.signedHashHex,
          };
        }

        const result = this.signatureService.verifySignature({
          pdfBuffer,
          signatureValueBase64: snap.signatureValueBase64,
          publicKeyPem: snap.publicKeyPem,
          expectedHashHex: snap.signedHashHex!,
        });

        return {
          signatureId: snap.id,
          signerId: snap.signerId,
          index: snap.index.get(),
          ok: result.ok,
          computedHashHex: result.computedHashHex,
          expectedHashHex: snap.signedHashHex,
        };
      })
      .filter(Boolean) as any[];

    return {
      ok: details.length > 0 && details.every((d) => d.ok),
      details,
    };
  }
}
