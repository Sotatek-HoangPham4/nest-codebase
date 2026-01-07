export const STORAGE_SERVICE = Symbol('STORAGE_SERVICE');

export interface StorageServiceInterface {
  write(path: string, buffer: Buffer, contentType?: string): Promise<void>;
  read(path: string): Promise<Buffer>;
  exists(path: string): Promise<boolean>;
  remove(path: string): Promise<void>;
  getPublicUrl(path: string): string; // dùng khi preview pdf/image
}
