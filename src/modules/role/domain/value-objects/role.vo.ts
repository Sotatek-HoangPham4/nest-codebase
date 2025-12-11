export class RoleIdVO {
  private constructor(private readonly value: string) {}
  static create(value: string) {
    if (!value || typeof value !== 'string')
      throw new Error('RoleId must be a non-empty string');
    return new RoleIdVO(value);
  }
  toString() {
    return this.value;
  }
}

export class RoleNameVO {
  private constructor(private readonly value: string) {}
  static create(value: string) {
    if (!value || typeof value !== 'string')
      throw new Error('RoleName must be a non-empty string');
    if (value.length > 100) throw new Error('RoleName too long');
    return new RoleNameVO(value);
  }
  toString() {
    return this.value;
  }
}
