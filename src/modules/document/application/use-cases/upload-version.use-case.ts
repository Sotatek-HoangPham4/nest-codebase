import { Injectable, Inject } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  type DocumentRepository,
} from '../../domain/repositories/document.repository.interface';
import { UploadFileDto } from '../dtos/upload-file.dto';
import { DocumentVersion } from '../../domain/entities/document.entity';
import { DocumentStatus } from '../../domain/value-objects/document-status.enum';

@Injectable()
export class UploadVersionUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private readonly repo: DocumentRepository,
  ) {}

  async execute(id: string, dto: UploadFileDto) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new Error('Document not found');

    const versionNumber = doc.versions.length + 1;

    const version = new DocumentVersion(
      versionNumber,
      dto.filePath,
      new Date(),
      dto.uploaderId,
      dto.sha256,
      doc.metadata,
    );

    doc.addVersion(version);

    // auto transition
    if (doc.status === DocumentStatus.DRAFT) {
      doc.setStatus(DocumentStatus.REVIEWING);
    }

    return this.repo.save(doc);
  }
}
