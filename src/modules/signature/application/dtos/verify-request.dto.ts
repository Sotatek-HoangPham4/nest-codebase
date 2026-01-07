import { IsOptional, IsString } from 'class-validator';

export class VerifyRequestDto {
  @IsString()
  documentId: string;

  /**
   * PDF base64 cần verify (nếu người dùng upload bản tải về).
   * Hoặc bạn chỉ cần hash/documentId rồi lấy bản gốc từ storage.
   */
  @IsOptional()
  @IsString()
  pdfBase64?: string;
}
