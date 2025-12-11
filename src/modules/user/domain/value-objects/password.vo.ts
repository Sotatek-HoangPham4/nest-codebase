// src/modules/user/domain/value-objects/password.vo.ts
export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(
    value: string,
    forbiddenWords: string[] = [],
    forbiddenNumbers: string[] = ['12345678', '123456789'],
  ): Password {
    if (!value) throw new Error('Password is required');

    if (value.length < 8 || value.length > 15) {
      throw new Error('Password must be 8-15 characters long');
    }

    if (!/[a-z]/.test(value)) {
      throw new Error('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(value)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(value)) {
      throw new Error('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      throw new Error('Password must contain at least one special character');
    }

    // Check forbidden words (tên riêng, địa danh, thông tin cá nhân...)
    const lowerValue = value.toLowerCase();
    for (const word of forbiddenWords) {
      if (lowerValue.includes(word.toLowerCase())) {
        throw new Error(`Password cannot contain forbidden word: ${word}`);
      }
    }

    // Check forbidden numbers
    for (const num of forbiddenNumbers) {
      if (value.includes(num)) {
        throw new Error(`Password cannot contain common number: ${num}`);
      }
    }

    return new Password(value);
  }

  public getValue(): string {
    return this.value;
  }

  public compare(plain: string): boolean {
    return this.value === plain;
  }
}
