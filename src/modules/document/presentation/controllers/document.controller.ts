import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Query,
  Patch,
  UploadedFile,
  UseInterceptors,
  Delete,
  Logger,
} from '@nestjs/common';

import { CreateDocumentDto } from '../../application/dtos/create-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from '../../application/dtos/upload-file.dto';
import { CreateDocumentUseCase } from '../../application/use-cases/create-document.use-case';
import { UpdateDocumentUseCase } from '../../application/use-cases/update-document.use-case';
import { DeleteDocumentUseCase } from '../../application/use-cases/delete-document.use-case';
import { UploadVersionUseCase } from '../../application/use-cases/upload-version.use-case';
import { GetDocumentUseCase } from '../../application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from '../../application/use-cases/list-documents.use-case';
import { UpdateDocumentDto } from '../../application/dtos/update-document.dto';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { DocumentResponseDto } from '../dtos/document.response.dto';
import { DeploySigningUseCase } from '../../application/use-cases/deploy-signing.usecase';
import { GetSigningSessionUseCase } from '../../application/use-cases/get-signing-session.usecase';
import { CancelSigningUseCase } from '../../application/use-cases/cancel-signing.usecase';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { DeploySigningDto } from '../dtos/deploy-signing.dto';

@Controller('documents')
@UseGuards(AuthGuard)
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(
    private readonly createUC: CreateDocumentUseCase,
    private readonly updateUC: UpdateDocumentUseCase,
    private readonly deleteUC: DeleteDocumentUseCase,
    private readonly uploadVersionUC: UploadVersionUseCase,
    private readonly getUC: GetDocumentUseCase,
    private readonly listUC: ListDocumentsUseCase,
    private readonly deployUc: DeploySigningUseCase,
    private readonly sessionUc: GetSigningSessionUseCase,
    private readonly cancelUc: CancelSigningUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateDocumentDto, @Req() req) {
    const userId = req.user.id;
    const res = await this.createUC.execute(userId, dto);
    return {
      message: 'Create document successfully',
      data: DocumentResponseDto.toResponse(res),
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    const res = await this.updateUC.execute(id, dto);
    return {
      message: 'Update document successfully',
      data: DocumentResponseDto.toResponse(res),
    };
  }

  @Post(':id/versions')
  async upload(@Param('id') id: string, @Body() dto: UploadFileDto) {
    const res = await this.uploadVersionUC.execute(id, dto);
    return {
      message: 'Upload document version successfully',
      data: DocumentResponseDto.toResponse(res),
    };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    const res = await this.getUC.execute(id);
    return {
      message: 'Get document detail successfully',
      data: DocumentResponseDto.toResponse(res),
    };
  }

  @Get()
  async list(@Req() req) {
    const res = await this.listUC.execute(req.user.id);
    return {
      message: 'Get document list successfully',
      data: res.map((doc) => DocumentResponseDto.toResponse(doc)),
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const res = await this.deleteUC.execute(id);
    return {
      message: 'Delete document detail successfully',
      data: DocumentResponseDto.toResponse(res),
    };
  }

  @Post(':id/deploy-signing')
  deploy(
    @Param('id') documentId: string,
    @Body() dto: DeploySigningDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.deployUc.execute({ documentId, actorId: user.id, ...dto });
  }

  @Get(':id/signing/session')
  session(
    @Param('id') documentId: string,
    @CurrentUser() user: { id: string },
    @Query('signerId') signerId?: string, // optional; default = current user
  ) {
    return this.sessionUc.execute({
      documentId,
      viewerId: user.id,
      signerId: signerId ?? user.id,
    });
  }

  @Post(':id/cancel-signing')
  cancel(@Param('id') documentId: string, @CurrentUser() user: { id: string }) {
    return this.cancelUc.execute({ documentId, actorId: user.id });
  }
}
