import { Injectable } from '@nestjs/common';
import { Client } from 'minio';
import { IStorageService } from '../../domain/services/storage.service.interface';

@Injectable()
export class MinioStorageAdapter implements IStorageService {
  private readonly client = new Client({
    endPoint: process.env.MINIO_ENDPOINT!,
    port: parseInt(process.env.MINIO_PORT!),
    useSSL: false,
    accessKey: process.env.MINIO_KEY!,
    secretKey: process.env.MINIO_SECRET!,
  });

  private readonly bucket = process.env.MINIO_BUCKET!;

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string> {
    await this.client.putObject(this.bucket, fileName, fileBuffer);

    return `${process.env.MINIO_PUBLIC}/${fileName}`;
  }

  async delete(filePath: string): Promise<void> {
    await this.client.removeObject(this.bucket, filePath);
  }
}
