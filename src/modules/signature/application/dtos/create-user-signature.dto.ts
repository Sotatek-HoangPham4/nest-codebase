import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SignatureType } from '../../domain/value-objects/signature-type.enum';

export class CreateUserSignatureDto {
  @IsEnum(SignatureType)
  type: SignatureType;

  // DRAWN
  @IsOptional()
  @IsString()
  signatureImageBase64?: string;

  // DIGITAL
  @IsOptional()
  @IsString()
  publicKeyPem?: string;
}
