import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

import {
  SIGNATURE_REPOSITORY,
  type SignatureRepositoryInterface,
} from '../../domain/repositories/signature.repository.interface';

import { DocumentOrm } from '@/modules/document/infrastructure/persistence/orm/document.orm-entity';
import { FileStorageService } from '../../infrastructure/services/file-storage.service';

type DocumentVersionJson = {
  versionNumber: number;
  filePath: string;
  sha256?: string;
  kind?: 'BASE' | 'SIGNED';
  signatureId?: string;
};

@Injectable()
export class PublicVerifySignatureUseCase {
  constructor(
    @Inject(SIGNATURE_REPOSITORY)
    private readonly sigRepo: SignatureRepositoryInterface,

    @InjectRepository(DocumentOrm)
    private readonly docRepo: Repository<DocumentOrm>,

    private readonly storage: FileStorageService,
  ) {}

  async execute(params: { signatureId: string }) {
    const sig = await this.sigRepo.findById(params.signatureId);
    if (!sig) throw new BadRequestException('Signature not found');

    const s = sig.snapshot;
    if (s.status !== 'SIGNED')
      throw new BadRequestException('Signature is not SIGNED');

    const doc = await this.docRepo.findOne({ where: { id: s.documentId } });
    if (!doc) throw new BadRequestException('Document not found');

    const versions: DocumentVersionJson[] = Array.isArray(doc.versions)
      ? doc.versions
      : [];

    // ✅ luôn ưu tiên tìm đúng version theo signatureId
    const signedVersion =
      versions.find((v) => v.kind === 'SIGNED' && v.signatureId === s.id) ??
      versions.find((v) => v.signatureId === s.id); // fallback nếu bạn chưa có kind

    if (!signedVersion?.filePath)
      throw new BadRequestException('Signed file version not found');

    const buf = await this.storage.read(signedVersion.filePath);
    const computed = createHash('sha256').update(buf).digest('hex');
    const expected = s.signedHashHex ?? '';

    const match = !!expected && computed === expected;

    return {
      ok: match,
      documentId: s.documentId,
      signatureId: s.id,
      signerId: s.signerId,
      index: s.index.get(),
      status: s.status,
      timestampIso: s.timestampIso,
      hash: { expected, computed, match },
      file: {
        versionNumber: signedVersion.versionNumber,
        filePath: signedVersion.filePath,
      },
      qrPayload: s.qrPayload,
    };
  }
}
