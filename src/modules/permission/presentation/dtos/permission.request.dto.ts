// HTTP request DTOs (class-validator decorators used in controllers).
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePermissionRequestDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  group?: string;
}

export class GetPermissionsQueryDto {
  @IsOptional()
  @IsString()
  group?: string;

  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  skip?: number;

  @IsOptional()
  take?: number;
}
