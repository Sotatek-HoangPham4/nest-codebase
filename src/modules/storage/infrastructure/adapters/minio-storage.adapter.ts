import { Injectable, Logger } from '@nestjs/common';
import { Client as MinioClient } from 'minio';
import { StorageServiceInterface } from '../../domain/services/storage.service.interface';

type MinioConfig = {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  publicBaseUrl: string; // ví dụ http://localhost:9000/app-storage
};

@Injectable()
export class MinioStorageAdapter implements StorageServiceInterface {
  private readonly logger = new Logger(MinioStorageAdapter.name);
  private client: MinioClient;

  constructor(private readonly cfg: MinioConfig) {
    this.client = new MinioClient({
      endPoint: cfg.endPoint,
      port: cfg.port,
      useSSL: cfg.useSSL,
      accessKey: cfg.accessKey,
      secretKey: cfg.secretKey,
    });
  }

  async ensureBucket() {
    const exists = await this.client.bucketExists(this.cfg.bucket);
    if (!exists) {
      await this.client.makeBucket(this.cfg.bucket, 'us-east-1');
      this.logger.log(`Created bucket: ${this.cfg.bucket}`);
    }
  }

  async write(
    path: string,
    buffer: Buffer,
    contentType = 'application/octet-stream',
  ) {
    await this.ensureBucket();
    await this.client.putObject(this.cfg.bucket, path, buffer, buffer.length, {
      'Content-Type': contentType,
    });
  }

  async read(path: string): Promise<Buffer> {
    await this.ensureBucket();
    const stream = await this.client.getObject(this.cfg.bucket, path);

    const chunks: Buffer[] = [];
    return await new Promise((resolve, reject) => {
      stream.on('data', (c) =>
        chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)),
      );
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async exists(path: string): Promise<boolean> {
    await this.ensureBucket();
    try {
      await this.client.statObject(this.cfg.bucket, path);
      return true;
    } catch {
      return false;
    }
  }

  async remove(path: string): Promise<void> {
    await this.ensureBucket();
    await this.client.removeObject(this.cfg.bucket, path);
  }

  getPublicUrl(path: string) {
    // Nếu bucket public hoặc bạn dùng presigned URL, bạn đổi logic ở đây.
    return `${this.cfg.publicBaseUrl}/${encodeURIComponent(path).replace(/%2F/g, '/')}`;
  }
}
