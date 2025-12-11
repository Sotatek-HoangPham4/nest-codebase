// permission/domain/value-objects/permission-code.vo.ts
// Value Object representing a permission code like "course.create".
// Encapsulates validation rules and canonicalization (lowercase, trim).
export class PermissionCode {
  readonly value: string;

  private constructor(value: string) {
    this.value = value;
    Object.freeze(this);
  }

  // Factory - validates format: "<resource>.<action>" and allowed chars
  static create(raw: string): PermissionCode {
    if (!raw || typeof raw !== 'string') {
      throw new Error('PermissionCode must be a non-empty string');
    }
    const normalized = raw.trim().toLowerCase();
    // Very simple validation. Extend if you need stricter rules.
    if (!/^[a-z0-9_]+\.[a-z0-9_]+$/.test(normalized)) {
      throw new Error(
        'PermissionCode must follow the pattern "<resource>.<action>"',
      );
    }
    return new PermissionCode(normalized);
  }

  toString(): string {
    return this.value;
  }
}
