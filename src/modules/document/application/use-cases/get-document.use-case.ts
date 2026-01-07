import { Injectable, Inject } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  type DocumentRepository,
} from '../../domain/repositories/document.repository.interface';

@Injectable()
export class GetDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY) private readonly repo: DocumentRepository,
  ) {}

  async execute(id: string) {
    return this.repo.findById(id);
  }
}
