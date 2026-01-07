import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
