import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ElasticsearchAdapter } from './infrastructure/adapters/elasticsearch.adapter';
import { MeilisearchAdapter } from './infrastructure/adapters/meilisearch.adapter';
import { OpenSearchAdapter } from './infrastructure/adapters/opensearch.adapter';

import { SearchController } from './presentation/controllers/search.controller';

import { IndexDocumentUseCase } from './application/use-cases/index-document.use-case';
import { SearchUseCase } from './application/use-cases/search.use-case';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.use-case';

@Module({
  imports: [ConfigModule],
  controllers: [SearchController],
  providers: [
    // Repository Adapter
    {
      provide: 'SearchRepository',
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const engine = config.get<string>('SEARCH_ENGINE');

        switch (engine) {
          case 'opensearch':
            return new OpenSearchAdapter();
          case 'meili':
            return new MeilisearchAdapter();
          default:
            return new ElasticsearchAdapter();
        }
      },
    },

    // UseCases
    {
      provide: IndexDocumentUseCase,
      useFactory: (repo) => new IndexDocumentUseCase(repo),
      inject: ['SearchRepository'],
    },
    {
      provide: SearchUseCase,
      useFactory: (repo) => new SearchUseCase(repo),
      inject: ['SearchRepository'],
    },
    {
      provide: DeleteDocumentUseCase,
      useFactory: (repo) => new DeleteDocumentUseCase(repo),
      inject: ['SearchRepository'],
    },
  ],

  exports: ['SearchRepository'],
})
export class SearchModule {}
