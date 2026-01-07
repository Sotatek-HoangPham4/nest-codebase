import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { StorageServiceInterface } from '../../domain/services/storage.service.interface';

@Injectable()
export class LocalStorageAdapter implements StorageServiceInterface {
  private root = path.join(process.cwd(), 'storage'); // ./storage

  private abs(p: string) {
    return path.join(this.root, p);
  }

  async write(p: string, buffer: Buffer) {
    const full = this.abs(p);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, buffer);
  }

  async read(p: string) {
    return fs.readFile(this.abs(p));
  }

  async exists(p: string) {
    try {
      await fs.stat(this.abs(p));
      return true;
    } catch {
      return false;
    }
  }

  async remove(p: string) {
    await fs.rm(this.abs(p), { force: true });
  }

  getPublicUrl(p: string) {
    // nếu bạn có serve static /storage thì map url ở đây
    return `/storage/${p}`;
  }
}
