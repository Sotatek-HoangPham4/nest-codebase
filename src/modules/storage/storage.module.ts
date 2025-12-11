import { Module } from '@nestjs/common';
import { StorageController } from './presentation/controllers/storage.controller';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';
import { FileStorageService } from './infrastructure/services/file-storage.service';

import { LocalStorageAdapter } from './infrastructure/adapters/local-storage.adapter';
import { IStorageServiceToken } from './domain/services/storage.service.interface';
// import { S3StorageAdapter } from './infrastructure/adapters/s3-storage.adapter';
// import { MinioStorageAdapter } from './infrastructure/adapters/minio-storage.adapter';

@Module({
  controllers: [StorageController],
  providers: [
    UploadFileUseCase,
    FileStorageService,
    {
      provide: IStorageServiceToken,
      useClass: LocalStorageAdapter,
    },
  ],
  exports: [],
})
export class StorageModule {}
