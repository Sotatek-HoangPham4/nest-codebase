import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { IAuditLogsRepository } from '../../domain/repositories/audit-logs.repository.interface';

@Injectable()
export class UnlockAccountUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject('IAuditLogsRepository')
    private readonly auditLogsRepo: IAuditLogsRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const unlocked = user.unlockAccount();

    await this.userRepo.update(unlocked);
    await this.auditLogsRepo.logAudit(id, 'ACCOUNT_UNLOCKED');

    return unlocked;
  }
}
