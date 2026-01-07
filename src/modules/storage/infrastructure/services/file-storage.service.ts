import { Inject, Injectable } from '@nestjs/common';
import {
  STORAGE_SERVICE,
  type StorageServiceInterface,
} from '../../domain/services/storage.service.interface';

@Injectable()
export class FileStorageService {
  constructor(
    @Inject(STORAGE_SERVICE) private readonly adapter: StorageServiceInterface,
  ) {}

  write(path: string, buffer: Buffer, contentType?: string) {
    return this.adapter.write(path, buffer, contentType);
  }

  read(path: string) {
    return this.adapter.read(path);
  }

  exists(path: string) {
    return this.adapter.exists(path);
  }

  remove(path: string) {
    return this.adapter.remove(path);
  }

  publicUrl(path: string) {
    return this.adapter.getPublicUrl(path);
  }
}
