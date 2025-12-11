import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';
import { IMfaService } from '../../domain/services/mfa.service.interface';

@Injectable()
export class MfaService implements IMfaService {
  async generateSecret(
    userId: string,
  ): Promise<{ secret: string; otpauthUrl: string }> {
    const secret = authenticator.generateSecret();
    const otpCode = authenticator.generate(secret);
    const otpauthUrl = authenticator.keyuri(userId, 'MyApp', secret);

    console.log(`[DEBUG] MFA secret for user ${userId}: ${secret}`);
    console.log(`[DEBUG] otpCode for user ${userId}: ${otpCode}`);
    console.log(`[DEBUG] otpauthUrl for user ${userId}: ${otpauthUrl}`);

    return { secret, otpauthUrl };
  }

  generateOtp(secret: string): string {
    const otp = authenticator.generate(secret);
    console.log(`[DEBUG] Generated OTP: ${otp}`);
    return otp;
  }

  verifyOtp(secret: string, otp: string) {
    return authenticator.check(otp, secret);
  }

  async generateQrCode(otpauthUrl: string): Promise<string> {
    return await qrcode.toDataURL(otpauthUrl);
  }
}
