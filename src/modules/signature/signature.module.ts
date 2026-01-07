import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SignatureController } from './presentation/controllers/signature.controller';

import { SignDocumentUseCase } from './application/use-cases/sign-document.use-case';
import { VerifySignatureUseCase } from './application/use-cases/verify-signature.use-case';
import { MultiSignUseCase } from './application/use-cases/multi-sign.use-case';

import { SignatureOrmEntity } from './infrastructure/persistence/orm/signature.orm-entity';
import { SignatureRepository } from './infrastructure/persistence/repositories/signature.repository';
import { SIGNATURE_REPOSITORY } from './domain/repositories/signature.repository.interface';

import { CryptoSignService } from './infrastructure/services/crypto-sign.service';
import { PdfSignService } from './infrastructure/services/pdf-sign.service';
import { QrService } from './infrastructure/services/qr.service';
import { TimestampService } from './infrastructure/services/timestamp.service';
import { SignatureService } from './infrastructure/services/signature.service';

import { UserSignatureOrmEntity } from './infrastructure/persistence/orm/user-signature.orm-entity';
import { UserSignatureRepository } from './infrastructure/persistence/repositories/user-signature.repository';
import { USER_SIGNATURE_REPOSITORY } from './domain/repositories/user-signature.repository.interface';

import { UserSignatureController } from './presentation/controllers/user-signature.controller';

import { CreateUserSignatureUseCase } from './application/use-cases/create-user-signature.use-case';
import { DeleteUserSignatureUseCase } from './application/use-cases/delete-user-signature.use-case';
import { RecreateUserSignatureUseCase } from './application/use-cases/recreate-user-signature.use-case';
import { GetUserSignatureUseCase } from './application/use-cases/get-user-signature.use-case';
import { PublicVerifySignatureUseCase } from './application/use-cases/public-verify-signature.use-case';
import { FileStorageService } from './infrastructure/services/file-storage.service';
import { DocumentOrm } from '../document/infrastructure/persistence/orm/document.orm-entity';

@Module({
  imports: [
    // ✅ quan trọng: phải có DocumentOrm ở đây
    TypeOrmModule.forFeature([
      SignatureOrmEntity,
      UserSignatureOrmEntity,
      DocumentOrm,
    ]),
  ],
  //
  controllers: [SignatureController, UserSignatureController],
  providers: [
    // Use-cases
    SignDocumentUseCase,
    VerifySignatureUseCase,
    MultiSignUseCase,

    // Infra services
    CryptoSignService,
    PdfSignService,
    QrService,
    TimestampService,
    SignatureService,

    // Repository binding (Interface -> Implementation)
    {
      provide: SIGNATURE_REPOSITORY,
      useClass: SignatureRepository,
    },

    CreateUserSignatureUseCase,
    DeleteUserSignatureUseCase,
    RecreateUserSignatureUseCase,
    GetUserSignatureUseCase,

    FileStorageService,

    PublicVerifySignatureUseCase,

    { provide: USER_SIGNATURE_REPOSITORY, useClass: UserSignatureRepository },
  ],
  exports: [SignDocumentUseCase, VerifySignatureUseCase, MultiSignUseCase],
})
export class SignatureModule {}
