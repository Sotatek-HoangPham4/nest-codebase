import { Injectable, Inject } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  type DocumentRepository,
} from '../../domain/repositories/document.repository.interface';

@Injectable()
export class ListDocumentsUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private readonly repo: DocumentRepository,
  ) {}

  async execute(ownerId: string, limit = 20, offset = 0) {
    return this.repo.findByOwner(ownerId, { limit, offset });
  }
}
