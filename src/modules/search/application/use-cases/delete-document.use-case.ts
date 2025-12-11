import { Inject, Injectable } from '@nestjs/common';
import { type SearchRepository } from '../../domain/repositories/search.repository.interface';

@Injectable()
export class DeleteDocumentUseCase {
  constructor(
    @Inject('SearchRepository') private readonly searchRepo: SearchRepository,
  ) {}

  async execute(index: string, id: string) {
    await this.searchRepo.deleteDocument(index, id);
    return { message: 'Document deleted' };
  }
}
