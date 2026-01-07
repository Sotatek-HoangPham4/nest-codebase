// modules/document/application/use-cases/get-signing-session.usecase.ts
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { requireSigningMetadata } from '../helpers/signing-validators';
import { DocumentOrm } from '../../infrastructure/persistence/orm/document.orm-entity';
import { SignatureOrmEntity } from '@/modules/signature/infrastructure/persistence/orm/signature.orm-entity';

export class GetSigningSessionUseCase {
  constructor(
    @InjectRepository(DocumentOrm)
    private readonly docRepo: Repository<DocumentOrm>,
    @InjectRepository(SignatureOrmEntity)
    private readonly sigRepo: Repository<SignatureOrmEntity>,
  ) {}

  async execute(params: {
    documentId: string;
    viewerId: string;
    signerId: string;
  }) {
    const doc = await this.docRepo.findOne({
      where: { id: params.documentId },
    });
    if (!doc) throw new BadRequestException('Document not found');

    const signing = requireSigningMetadata(doc.metadata);

    // permission: viewer must be in viewers OR owner OR signer in list
    const viewers = signing.participants.permissions?.viewers ?? [];
    const isOwner = signing.participants.ownerId === params.viewerId;
    const isViewer = viewers.includes(params.viewerId);
    const isSigner = (signing.participants.signers ?? []).some(
      (s) => s.userId === params.viewerId,
    );

    if (!isOwner && !isViewer && !isSigner)
      throw new ForbiddenException('No permission to view');

    const baseV = signing.deploy?.baseVersionNumber;
    if (!baseV)
      throw new BadRequestException('Document is not deployed for signing');

    const baseVersion = (doc.versions ?? []).find(
      (v) => v.versionNumber === baseV,
    );
    if (!baseVersion) throw new BadRequestException('Base version not found');

    const tasks = await this.sigRepo.find({
      where: { documentId: doc.id },
      order: { index: 'ASC' },
    });

    const yourTask = tasks.find((t) => t.signerId === params.signerId);
    if (!yourTask) throw new ForbiddenException('You are not a signer');

    const placements = (signing.placements ?? [])
      .filter(
        (p) => p.signerId === params.signerId && p.index === yourTask.index,
      )
      .map((p) => ({ placementId: p.placementId, page: p.page, rect: p.rect }));

    return {
      success: true,
      data: {
        documentId: doc.id,
        signingStatus: signing.status,
        baseVersionNumber: baseV,
        pdfPreviewUrl: `/files/${baseVersion.filePath}`,
        yourSignatureTask: {
          index: yourTask.index,
          status: yourTask.status,
          allowedSignatureTypes: signing.policy.allowedSignatureTypes,
          placements,
        },
        workflow: tasks.map((t) => ({
          signerId: t.signerId,
          index: t.index,
          status: t.status,
        })),
      },
    };
  }
}
