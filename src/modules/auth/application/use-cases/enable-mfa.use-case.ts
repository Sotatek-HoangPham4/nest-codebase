import { Inject, Injectable } from '@nestjs/common';
import type { IAuthRepository } from '../../domain/repositories/auth.repository.interface';
import type { IMfaService } from '../../domain/services/mfa.service.interface';

@Injectable()
export class EnableMfaUseCase {
  constructor(
    @Inject('IAuthRepository')
    private readonly authRepo: IAuthRepository,
    @Inject('IMfaService')
    private readonly mfaService: IMfaService,
  ) {}

  async execute(userId: string) {
    const { secret, otpauthUrl } = await this.mfaService.generateSecret(userId);
    await this.authRepo.saveMfaSecret(userId, secret);

    const qrCode = await this.mfaService.generateQrCode(otpauthUrl);
    return { qrCode };
  }
}
