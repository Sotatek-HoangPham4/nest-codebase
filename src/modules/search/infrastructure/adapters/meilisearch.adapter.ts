import { Injectable } from '@nestjs/common';
import { MeiliSearch } from 'meilisearch';
import { SearchRepository } from '../../domain/repositories/search.repository.interface';

@Injectable()
export class MeilisearchAdapter implements SearchRepository {
  private client: MeiliSearch;

  constructor() {
    this.client = new MeiliSearch({
      host: process.env.MEILI_HOST!,
      apiKey: process.env.MEILI_API_KEY!,
    });
  }

  async indexDocument(index: string, id: string, data: any) {
    const indexRef = this.client.index(index);
    await indexRef.addDocuments([{ id, ...data }]);
  }

  async search(index: string, query: any) {
    const indexRef = this.client.index(index);
    return await indexRef.search(query.q, { limit: query.limit });
  }

  async deleteDocument(index: string, id: string) {
    const indexRef = this.client.index(index);
    await indexRef.deleteDocument(id);
  }
}
