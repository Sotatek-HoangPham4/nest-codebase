// Simple DTO used by Application layer (input). Kept framework-agnostic.
export type CreatePermissionDto = {
  id?: string; // optional - repository can generate
  code: string; // e.g. "course.create"
  description?: string;
  group?: string; // e.g. "course"
};
