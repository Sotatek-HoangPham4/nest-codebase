import { Inject, Injectable } from '@nestjs/common';
import { type SearchRepository } from '../../domain/repositories/search.repository.interface';
import { SearchDto } from '../dtos/search.dto';

@Injectable()
export class SearchUseCase {
  constructor(
    @Inject('SearchRepository') private readonly searchRepo: SearchRepository,
  ) {}

  async execute(dto: SearchDto) {
    return await this.searchRepo.search(dto.index, {
      q: dto.query,
      limit: dto.limit ?? 10,
    });
  }
}
