import { Injectable } from '@nestjs/common';
import { Client } from '@opensearch-project/opensearch';
import { SearchRepository } from '../../domain/repositories/search.repository.interface';

@Injectable()
export class OpenSearchAdapter implements SearchRepository {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.OPENSEARCH_NODE!,
    });
  }

  async indexDocument(index: string, id: string, data: any) {
    await this.client.index({
      index,
      id,
      body: data,
      refresh: true,
    });
  }

  async search(index: string, query: any) {
    const result = await this.client.search({
      index,
      body: {
        query: {
          match: { content: query.q },
        },
      },
      size: query.limit,
    });

    return result.body.hits.hits.map((h) => h._source);
  }

  async deleteDocument(index: string, id: string) {
    await this.client.delete({ index, id });
  }
}
