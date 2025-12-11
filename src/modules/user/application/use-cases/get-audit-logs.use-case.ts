import { Inject, Injectable } from '@nestjs/common';
import type { IAuditLogsRepository } from '../../domain/repositories/audit-logs.repository.interface';

@Injectable()
export class GetAuditLogsUseCase {
  constructor(
    @Inject('IAuditLogsRepository')
    private readonly repo: IAuditLogsRepository,
  ) {}

  async execute(userId: string, page: number, limit: number) {
    return await this.repo.paginateAuditLogs(userId, page, limit);
  }
}
