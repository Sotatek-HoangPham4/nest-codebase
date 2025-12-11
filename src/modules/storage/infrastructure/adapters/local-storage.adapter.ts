import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IStorageService } from '../../domain/services/storage.service.interface';

@Injectable()
export class LocalStorageAdapter implements IStorageService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir);
    }
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    const fullPath = path.join(this.uploadDir, fileName);

    await fs.promises.writeFile(fullPath, fileBuffer);

    return `/uploads/${fileName}`;
  }

  async delete(filePath: string): Promise<void> {
    const fullPath = path.join(process.cwd(), filePath);
    await fs.promises.unlink(fullPath);
  }
}
