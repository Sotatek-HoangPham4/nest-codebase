import { Inject, Injectable } from '@nestjs/common';
import {
  type IStorageService,
  IStorageServiceToken,
} from '../../domain/services/storage.service.interface';

@Injectable()
export class FileStorageService {
  constructor(
    @Inject(IStorageServiceToken)
    private readonly storage: IStorageService,
  ) {}

  upload(fileBuffer: Buffer, fileName: string, mimeType: string) {
    return this.storage.upload(fileBuffer, fileName, mimeType);
  }

  delete(filePath: string) {
    return this.storage.delete(filePath);
  }
}
