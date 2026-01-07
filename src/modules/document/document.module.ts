import { Module } from '@nestjs/common';
import { DocumentController } from './presentation/controllers/document.controller';
import { CollabGateway } from './presentation/gateways/collab.gateway';

import { CreateDocumentUseCase } from './application/use-cases/create-document.use-case';
import { TypeOrmDocumentRepository } from './infrastructure/persistence/repositories/document.repository';
import { DocumentOrm } from './infrastructure/persistence/orm/document.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersioningService } from './infrastructure/services/versioning.service';
import { DeleteDocumentUseCase } from './application/use-cases/delete-document.use-case';
import { UploadVersionUseCase } from './application/use-cases/upload-version.use-case';
import { GetDocumentUseCase } from './application/use-cases/get-document.use-case';
import { ListDocumentsUseCase } from './application/use-cases/list-documents.use-case';
import { DOCUMENT_REPOSITORY } from './domain/repositories/document.repository.interface';
import { UpdateDocumentUseCase } from './application/use-cases/update-document.use-case';
import { DeploySigningUseCase } from './application/use-cases/deploy-signing.usecase';
import { GetSigningSessionUseCase } from './application/use-cases/get-signing-session.usecase';
import { CancelSigningUseCase } from './application/use-cases/cancel-signing.usecase';
import { SignatureOrmEntity } from '../signature/infrastructure/persistence/orm/signature.orm-entity';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DocumentOrm, SignatureOrmEntity]),
    StorageModule,
  ],
  controllers: [DocumentController],
  providers: [
    CollabGateway,
    CreateDocumentUseCase,
    DeleteDocumentUseCase,
    UploadVersionUseCase,
    UpdateDocumentUseCase,
    GetDocumentUseCase,
    ListDocumentsUseCase,
    DeploySigningUseCase,
    GetSigningSessionUseCase,
    CancelSigningUseCase,
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: TypeOrmDocumentRepository,
    },
    // bind storage service token at app root to your actual storage adapter (S3/minio/local)
  ],
  exports: [],
})
export class DocumentModule {}
