import { Injectable } from '@nestjs/common';
import { UpdateSettingsUseCase } from '../use-cases/update-settings.use-case';
import { LockAccountUseCase } from '../use-cases/lock-account.use-case';
import { UnlockAccountUseCase } from '../use-cases/unlock-account.use-case';
import { GetAuditLogsUseCase } from '../use-cases/get-audit-logs.use-case';

@Injectable()
export class AuditLogsService {
  constructor(
    private readonly lockAccountUseCase: LockAccountUseCase,
    private readonly unlockAccountUseCase: UnlockAccountUseCase,
    private readonly getAuditLogsUseCase: GetAuditLogsUseCase,
  ) {}

  lockAccount(id: string) {
    return this.lockAccountUseCase.execute(id);
  }

  unlockAccount(id: string) {
    return this.unlockAccountUseCase.execute(id);
  }

  getAuditLogs(id: string, page: number, limit: number) {
    return this.getAuditLogsUseCase.execute(id, page, limit);
  }
}
