/**
 * IndexVO: vị trí chữ ký thứ n trong quy trình ký (0..N-1)
 * Dùng VO để đảm bảo invariant (không âm, không NaN)
 */
export class IndexVO {
  private constructor(private readonly value: number) {}

  static create(value: number): IndexVO {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Index must be a non-negative integer');
    }
    return new IndexVO(value);
  }

  get(): number {
    return this.value;
  }
}
