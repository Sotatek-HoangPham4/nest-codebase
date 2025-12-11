import { Injectable, Inject } from '@nestjs/common';
import { type SearchRepository } from '../../domain/repositories/search.repository.interface';
import { IndexDocumentDto } from '../dtos/index-document.dto';

@Injectable()
export class IndexDocumentUseCase {
  constructor(
    @Inject('SearchRepository') private readonly searchRepo: SearchRepository,
  ) {}

  async execute(dto: IndexDocumentDto) {
    await this.searchRepo.indexDocument(dto.index, dto.id, dto.data);
    return { message: 'Indexed successfully' };
  }
}
