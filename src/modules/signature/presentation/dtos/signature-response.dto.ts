export class SignatureResponseDto<T = any> {
  success: boolean;
  data?: T;
  error?: string;

  static ok<T>(data: T): SignatureResponseDto<T> {
    return { success: true, data };
  }

  static fail(message: string): SignatureResponseDto {
    return { success: false, error: message };
  }
}
