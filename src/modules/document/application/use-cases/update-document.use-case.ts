import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  type DocumentRepository,
} from '../../domain/repositories/document.repository.interface';
import { UpdateDocumentDto } from '../dtos/update-document.dto';

@Injectable()
export class UpdateDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private readonly repo: DocumentRepository,
  ) {}

  async execute(id: string, dto: UpdateDocumentDto) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new Error('Document not found');

    if ((doc.status ?? '').toLowerCase() !== 'draft') {
      throw new BadRequestException(
        'Document is frozen. Cannot update content after deploy.',
      );
    }

    if (dto.content) {
      doc.content = dto.content;
    }

    doc.metadata = {
      ...doc.metadata,
      ...dto.metadata,
    };

    if (dto.title) doc.metadata.title = dto.title;
    if (dto.description) doc.metadata.description = dto.description;

    doc.updatedAt = new Date();

    return this.repo.save(doc);
  }
}
