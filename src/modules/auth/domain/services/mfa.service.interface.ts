export interface IMfaService {
  generateSecret(
    userId: string,
  ): Promise<{ secret: string; otpauthUrl: string }>;
  generateOtp(secret: string): string;
  verifyOtp(secret: string, otp: string): boolean;
  generateQrCode(otpauthUrl: string): Promise<string>;
}
