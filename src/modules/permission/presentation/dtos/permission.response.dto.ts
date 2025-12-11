export class PermissionResponseDto {
  id: string;
  code: string;
  description?: string;
  group?: string;
  createdAt: string;
  updatedAt: string;
}

export class PermissionListResponseDto {
  items: PermissionResponseDto[];
  total: number;
}
