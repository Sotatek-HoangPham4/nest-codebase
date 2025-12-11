import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { IndexDocumentUseCase } from '../../application/use-cases/index-document.use-case';
import { SearchUseCase } from '../../application/use-cases/search.use-case';
import { DeleteDocumentUseCase } from '../../application/use-cases/delete-document.use-case';

@Controller('/api/v1/search')
export class SearchController {
  constructor(
    private readonly indexUC: IndexDocumentUseCase,
    private readonly searchUC: SearchUseCase,
    private readonly deleteUC: DeleteDocumentUseCase,
  ) {}

  @Post('/index')
  index(@Body() body) {
    return this.indexUC.execute(body);
  }

  @Get()
  search(@Query() query) {
    return this.searchUC.execute(query);
  }

  @Delete('/:index/:id')
  delete(@Query('index') index: string, @Query('id') id: string) {
    return this.deleteUC.execute(index, id);
  }
}
