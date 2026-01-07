import { IsString } from 'class-validator';

export class UploadFileDto {
  @IsString()
  filePath: string; // storage path returned by storage adapter
  @IsString()
  uploaderId: string;
  @IsString()
  sha256: string;
}
