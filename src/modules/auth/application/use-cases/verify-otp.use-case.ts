import { Inject, Injectable } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import type { IMfaService } from '../../domain/services/mfa.service.interface';

@Injectable()
export class VerifyOtpUseCase {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepo: IAuthRepository,
    @Inject('IMfaService')
    private readonly mfaService: IMfaService,
  ) {}

  async execute(userId: string, otp: string) {
    const secret = await this.authRepo.getMfaSecret(userId);
    if (!secret) throw new Error('MFA not enabled');
    const isValid = this.mfaService.verifyOtp(secret, otp);
    if (!isValid) throw new Error('Invalid OTP');
    return true;
  }
}
