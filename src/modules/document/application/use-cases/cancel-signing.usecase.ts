// modules/document/application/use-cases/cancel-signing.usecase.ts
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  requireSigningMetadata,
  ensureOwnerOrEditor,
} from '../helpers/signing-validators';
import { DocumentOrm } from '../../infrastructure/persistence/orm/document.orm-entity';
import { SignatureOrmEntity } from '@/modules/signature/infrastructure/persistence/orm/signature.orm-entity';

export class CancelSigningUseCase {
  constructor(
    @InjectRepository(DocumentOrm)
    private readonly docRepo: Repository<DocumentOrm>,
    @InjectRepository(SignatureOrmEntity)
    private readonly sigRepo: Repository<SignatureOrmEntity>,
  ) {}

  async execute(params: { documentId: string; actorId: string }) {
    const doc = await this.docRepo.findOne({
      where: { id: params.documentId },
    });
    if (!doc) throw new BadRequestException('Document not found');

    const signing = requireSigningMetadata(doc.metadata);
    ensureOwnerOrEditor(signing, params.actorId);

    if (!['READY_TO_SIGN', 'SIGNING'].includes(signing.status)) {
      throw new BadRequestException(
        `Cannot cancel from status ${signing.status}`,
      );
    }

    // revoke all pending
    const sigs = await this.sigRepo.find({ where: { documentId: doc.id } });
    for (const s of sigs) {
      if (s.status === 'PENDING') {
        s.status = 'REVOKED';
        s.updatedAt = new Date();
        await this.sigRepo.save(s);
      }
    }

    signing.status = 'CANCELLED';
    // reset doc back to draft (your call: keep versions or not)
    doc.status = 'DRAFT';

    // Optionally clear deploy info & signatures list in metadata
    signing.deploy = {
      deployedAt: null,
      deployedBy: null,
      baseVersionNumber: null,
    };
    doc.metadata = { ...(doc.metadata ?? {}), signing };

    await this.docRepo.save(doc);

    return { success: true, data: { documentId: doc.id, status: doc.status } };
  }
}
