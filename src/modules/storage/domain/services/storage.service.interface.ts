export const IStorageServiceToken = 'IStorageService';

export interface IStorageService {
  upload(
    fileBuffer: Buffer,
    fileName: string,
    mimeType: string,
  ): Promise<string>;
  delete(filePath: string): Promise<void>;
}
