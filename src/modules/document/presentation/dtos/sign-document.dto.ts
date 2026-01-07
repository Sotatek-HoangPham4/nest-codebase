// modules/signature/presentation/dtos/sign-document.dto.ts
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SignDocumentDto {
  @IsString()
  documentId: string;

  @IsInt()
  @Min(0)
  index: number;

  @IsOptional()
  @IsString()
  otpToken?: string;
}
