import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { STORAGE_SERVICE } from './domain/services/storage.service.interface';
import { FileStorageService } from './infrastructure/services/file-storage.service';
import { LocalStorageAdapter } from './infrastructure/adapters/local-storage.adapter';
import { MinioStorageAdapter } from './infrastructure/adapters/minio-storage.adapter';

import { StorageController } from './presentation/controllers/storage.controller';
import { UploadFileUseCase } from './application/use-cases/upload-file.use-case';

@Module({
  imports: [ConfigModule],
  controllers: [StorageController],
  providers: [
    FileStorageService,
    UploadFileUseCase,
    {
      provide: STORAGE_SERVICE,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => {
        const driver = (
          cfg.get<string>('STORAGE_DRIVER') ?? 'local'
        ).toLowerCase();

        if (driver === 'minio') {
          return new MinioStorageAdapter({
            endPoint: cfg.get<string>('MINIO_ENDPOINT') ?? 'localhost',
            port: Number(cfg.get<string>('MINIO_PORT') ?? '9000'),
            useSSL: (cfg.get<string>('MINIO_SSL') ?? 'false') === 'true',
            accessKey: cfg.get<string>('MINIO_ACCESS_KEY') ?? 'minioadmin',
            secretKey: cfg.get<string>('MINIO_SECRET_KEY') ?? 'minioadmin123',
            bucket: cfg.get<string>('MINIO_BUCKET') ?? 'app-storage',
            publicBaseUrl:
              cfg.get<string>('MINIO_PUBLIC_BASE_URL') ??
              'http://localhost:9000/app-storage',
          });
        }

        return new LocalStorageAdapter();
      },
    },
  ],
  exports: [FileStorageService],
})
export class StorageModule {}
