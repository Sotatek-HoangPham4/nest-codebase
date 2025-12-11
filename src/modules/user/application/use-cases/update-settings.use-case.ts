import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import type { IAuditLogsRepository } from '../../domain/repositories/audit-logs.repository.interface';

@Injectable()
export class UpdateSettingsUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject('IAuditLogsRepository')
    private readonly auditLogsRepo: IAuditLogsRepository,
  ) {}

  async execute(id: string, settings: Record<string, any>) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('User not found');

    const updated = user.update({
      settings: { ...user.settings, ...settings },
    });

    await this.userRepo.update(updated);
    await this.auditLogsRepo.logAudit(id, 'SETTINGS_UPDATED', settings);

    return updated;
  }
}
