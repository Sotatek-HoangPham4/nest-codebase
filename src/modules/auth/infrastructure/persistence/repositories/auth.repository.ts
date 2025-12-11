import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '@/modules/user/domain/repositories/user.repository.interface';
import { IAuthRepository } from '@/modules/auth/domain/repositories/auth.repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
  ) {}

  async saveMfaSecret(userId: string, secret: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const updatedUser = user.enableMfa(secret);
    await this.userRepo.update(updatedUser);
  }

  async getMfaSecret(userId: string): Promise<string | null> {
    const user = await this.userRepo.findById(userId);
    return user?.two_factor_secret ?? null;
  }
}
