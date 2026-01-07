import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FileStorageService {
  private readonly STORAGE_ROOT =
    process.env.STORAGE_ROOT ?? path.join(process.cwd(), 'storage');

  private resolve(p: string) {
    return path.isAbsolute(p) ? p : path.join(this.STORAGE_ROOT, p);
  }

  async read(filePath: string): Promise<Buffer> {
    return fs.readFile(this.resolve(filePath));
  }

  async write(params: {
    dir: string;
    filename: string;
    buffer: Buffer;
  }): Promise<string> {
    const fullDir = this.resolve(params.dir);
    await fs.mkdir(fullDir, { recursive: true });
    const fullPath = path.join(fullDir, params.filename);
    await fs.writeFile(fullPath, params.buffer);

    const rel = path.relative(this.STORAGE_ROOT, fullPath).replace(/\\/g, '/');
    return rel;
  }
}
