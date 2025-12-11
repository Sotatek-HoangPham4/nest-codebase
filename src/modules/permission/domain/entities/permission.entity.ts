// Domain Entity for Permission.
// Keep domain logic here (e.g. rename, validation) if needed.
import { PermissionCode } from '../value-objects/permission-code.vo';

export type PermissionProps = {
  id: string;
  code: string | PermissionCode;
  description?: string;
  group?: string; // optional grouping e.g. "course", "trade"
  createdAt?: Date;
  updatedAt?: Date;
};

export class Permission {
  readonly id: string;
  readonly code: PermissionCode;
  description?: string;
  group?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: PermissionProps) {
    this.id = props.id;

    // Convert string → Value Object automatically
    this.code =
      props.code instanceof PermissionCode
        ? props.code
        : PermissionCode.create(props.code);
    this.description = props.description;
    this.group = props.group;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  // Domain behavior example: update description
  updateDescription(newDescription: string) {
    this.description = newDescription;
    this.touch();
  }

  private touch() {
    this.updatedAt = new Date();
  }
}
