import { Injectable } from '@nestjs/common';
import { FileStorageService } from '../../infrastructure/services/file-storage.service';

@Injectable()
export class UploadFileUseCase {
  constructor(private readonly storageService: FileStorageService) {}

  async execute(file: Express.Multer.File) {
    const { buffer, originalname, mimetype } = file;

    const url = await this.storageService.upload(
      buffer,
      originalname,
      mimetype,
    );

    return { url };
  }
}
