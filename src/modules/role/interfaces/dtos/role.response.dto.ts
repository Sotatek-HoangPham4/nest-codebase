export class RoleResponseDto {
  id!: string;
  name!: string;
  description?: string | null;
  createdAt!: string;
  updatedAt?: string | null;

  static fromPrimitives(p: any) {
    return Object.assign(new RoleResponseDto(), p);
  }
}
