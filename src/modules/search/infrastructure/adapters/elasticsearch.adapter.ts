import { Injectable } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { SearchRepository } from '../../domain/repositories/search.repository.interface';

@Injectable()
export class ElasticsearchAdapter implements SearchRepository {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.ELASTIC_NODE!,
    });
  }

  async indexDocument(index: string, id: string, data: any): Promise<void> {
    await this.client.index({
      index,
      id,
      document: data,
      refresh: 'true',
    });
  }

  async search(index: string, query: any) {
    const res = await this.client.search({
      index,
      query: {
        multi_match: {
          query: query.q,
          fields: ['title', 'description', 'content'],
        },
      },
      size: query.limit,
    });

    return res.hits.hits.map((i) => i._source);
  }

  async deleteDocument(index: string, id: string): Promise<void> {
    await this.client.delete({ index, id });
  }
}
