import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash, randomUUID } from 'crypto';

import {
  requireSigningMetadata,
  ensureOwnerOrEditor,
  validateSetup,
} from '../helpers/signing-validators';

import { DocumentOrm } from '../../infrastructure/persistence/orm/document.orm-entity';
import { SignatureOrmEntity } from '@/modules/signature/infrastructure/persistence/orm/signature.orm-entity';
import { DocumentVersionJson } from '../../presentation/dtos/document.response.dto';

import { FileStorageService } from '@/modules/storage/infrastructure/services/file-storage.service';

function sha256Hex(buf: Buffer) {
  return createHash('sha256').update(buf).digest('hex');
}

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { renderEditorJsonToPdfBuffer } from '../services/editor-pdf-renderer';

function slateToText(nodes: any): string {
  if (!Array.isArray(nodes)) return '';
  return nodes
    .map((n) => {
      if (typeof n?.text === 'string') return n.text;
      if (Array.isArray(n?.children)) return slateToText(n.children);
      return '';
    })
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function renderEditorContentToPdfBuffer(content: any): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const bodyText = slateToText(content) || '(empty)';

  page.drawText('Document', {
    x: 50,
    y: 800,
    size: 16,
    font,
    color: rgb(0, 0, 0),
  });

  // MVP: vẽ text đơn giản (không layout rich text)
  page.drawText(bodyText, {
    x: 50,
    y: 760,
    size: 12,
    font,
    color: rgb(0, 0, 0),
    maxWidth: 500,
    lineHeight: 16,
  });

  const bytes = await pdfDoc.save();
  return Buffer.from(bytes);
}

@Injectable()
export class DeploySigningUseCase {
  constructor(
    @InjectRepository(DocumentOrm)
    private readonly docRepo: Repository<DocumentOrm>,

    @InjectRepository(SignatureOrmEntity)
    private readonly sigRepo: Repository<SignatureOrmEntity>,

    private readonly storage: FileStorageService,
  ) {}

  async execute(params: {
    documentId: string;
    actorId: string;
    notify?: boolean;
    message?: string;
  }) {
    const doc = await this.docRepo.findOne({
      where: { id: params.documentId },
    });
    if (!doc) throw new BadRequestException('Document not found');

    const signing = requireSigningMetadata(doc.metadata);
    ensureOwnerOrEditor(signing, params.actorId);

    if ((doc.status ?? '').toLowerCase() !== 'draft') {
      throw new BadRequestException('Document must be DRAFT to deploy signing');
    }

    validateSetup(signing);

    // 1) Freeze statuses
    doc.status = 'READY_TO_SIGN';
    signing.status = 'READY_TO_SIGN';

    // 2) Render base PDF
    const pdfBuf = await renderEditorJsonToPdfBuffer(doc.content);
    const hash = sha256Hex(pdfBuf);

    // 3) Create base version + upload to storage (MinIO)
    const nextVersion = (doc.versions?.length ?? 0) + 1;
    const filePath = `documents/${doc.id}/base_v${nextVersion}.pdf`;

    // ✅ upload thật
    await this.storage.write(filePath, pdfBuf, 'application/pdf');

    const baseVersion: DocumentVersionJson = {
      versionNumber: nextVersion,
      filePath,
      createdAt: new Date().toISOString(),
      createdBy: params.actorId,
      sha256: hash,
      kind: 'BASE',
    };

    doc.versions = [...(doc.versions ?? []), baseVersion];

    // 4) Update deploy info in metadata
    signing.deploy = {
      deployedAt: new Date().toISOString(),
      deployedBy: params.actorId,
      baseVersionNumber: nextVersion,
    };
    doc.metadata = { ...(doc.metadata ?? {}), signing };

    await this.docRepo.save(doc);

    // 5) Create signatures PENDING (tasks)
    const signers = signing.participants.signers
      .slice()
      .sort((a, b) => a.index - b.index);

    // tránh tạo trùng khi deploy lại (MVP)
    // (optional) delete old pending tasks trước khi tạo mới
    await this.sigRepo.delete({ documentId: doc.id });

    for (const s of signers) {
      const sig = this.sigRepo.create({
        id: randomUUID(),
        documentId: doc.id,
        signerId: s.userId,
        type: 'DRAW', // task type (không phải profile type)
        index: s.index,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await this.sigRepo.save(sig);
    }

    return {
      success: true,
      data: {
        documentId: doc.id,
        signingStatus: signing.status,
        baseVersion,
        nextSigner: signers[0]
          ? { userId: signers[0].userId, index: signers[0].index }
          : null,
      },
    };
  }
}
