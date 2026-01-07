// modules/document/presentation/dtos/deploy-signing.dto.ts
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class DeploySigningDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  notify?: boolean;
}
