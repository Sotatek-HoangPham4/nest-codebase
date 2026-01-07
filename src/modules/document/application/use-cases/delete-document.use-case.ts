import { Injectable, Inject } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  type DocumentRepository,
} from '../../domain/repositories/document.repository.interface';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private readonly repo: DocumentRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const doc = await this.repo.findById(id);
    if (!doc) throw new Error('Document not found');

    await this.repo.delete(id);
  }
}
