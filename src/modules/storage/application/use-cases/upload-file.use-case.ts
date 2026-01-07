import { BadRequestException, Injectable } from '@nestjs/common';
import { FileStorageService } from '../../infrastructure/services/file-storage.service';

@Injectable()
export class UploadFileUseCase {
  constructor(private readonly storageService: FileStorageService) {}

  async execute(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('file is required');

    const key = `uploads/${Date.now()}_${file.originalname}`;

    await this.storageService.write(key, file.buffer, file.mimetype);

    return {
      key,
      url: this.storageService.publicUrl(key),
      size: file.size,
      contentType: file.mimetype,
      originalName: file.originalname,
    };
  }
}
