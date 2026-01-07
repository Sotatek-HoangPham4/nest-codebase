import { Injectable, Inject } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  type DocumentRepository,
} from '../../domain/repositories/document.repository.interface';
import { CreateDocumentDto } from '../dtos/create-document.dto';
import { Document } from '../../domain/entities/document.entity';
import { v4 as uuid } from 'uuid';
import { DocumentStatus } from '../../domain/value-objects/document-status.enum';

@Injectable()
export class CreateDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly repo: DocumentRepository,
  ) {}

  async execute(ownerId: string, dto?: CreateDocumentDto): Promise<Document> {
    const title = dto?.title?.trim() || 'Untitled document';

    // 🔍 1️⃣ Check existing "Untitled document"
    if (title === 'Untitled document') {
      const existing = await this.repo.findByOwnerAndTitle(
        ownerId,
        'Untitled document',
      );

      if (existing) {
        return existing; // ✅ Google Docs behavior
      }
    }

    const content: any[] = [];

    // 🆕 2️⃣ Create new document
    const document = new Document(
      uuid(),
      ownerId,
      [],
      {
        title,
        ...dto?.metadata,
      },
      DocumentStatus.DRAFT,
      [],
      [
        {
          user_id: ownerId,
          role: 'owner',
          added_at: new Date(),
        },
      ],
    );

    return this.repo.create(document);
  }
}
