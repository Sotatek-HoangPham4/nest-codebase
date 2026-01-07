import { IsOptional, IsString, IsEnum } from 'class-validator';
import { DocumentStatus } from '../../domain/value-objects/document-status.enum';

export class UpdateDocumentDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  content?: Record<string, any>;

  @IsOptional()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsString()
  description?: string;
}
