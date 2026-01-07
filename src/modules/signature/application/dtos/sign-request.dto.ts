import { IsEnum, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { SignatureType } from '../../domain/value-objects/signature-type.enum';

export class SignRequestDto {
  @IsString()
  documentId: string;

  @IsString()
  signerId?: string;

  @IsEnum(SignatureType)
  type: SignatureType;

  @IsInt()
  @Min(0)
  index: number;

  /**
   * Base64 PDF hoặc fileKey (nếu tài liệu nằm trong S3/Cloud)
   * Ở dự án thật bạn sẽ dùng fileKey + storage service.
   */
  @IsOptional()
  @IsString()
  pdfBase64?: string;

  /**
   * Mã OTP đã xác thực ở layer khác (OTP module),
   * Use-case signature chỉ nhận kết quả “đã qua OTP”.
   */
  @IsString()
  otpToken?: string;

  /**
   * Dữ liệu xác thực AI (tùy chọn).
   * Ví dụ faceMatchScore/voiceScore/handwritingScore…
   */
  @IsOptional()
  @IsString()
  aiProofJson?: string;

  /**
   * Private key (demo). Thực tế: không gửi private key từ client.
   * Dùng HSM/KMS/CA hoặc ký server-side theo chính sách.
   */
  @IsOptional()
  @IsString()
  privateKeyPem?: string;

  @IsOptional()
  @IsEnum(['RSA', 'ECDSA'] as const)
  algorithm?: 'RSA' | 'ECDSA';
}
