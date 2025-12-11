import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
  Query,
} from '@nestjs/common';

import { AuditLogsService } from '../../application/services/audit-logs.service';

@Controller('users')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post(':id/lock')
  async lockAccount(@Param('id') id: string) {
    await this.auditLogsService.lockAccount(id);
    return {
      message: 'Account locked successfully',
    };
  }

  @Post(':id/unlock')
  async unlockAccount(@Param('id') id: string) {
    await this.auditLogsService.unlockAccount(id);
    return {
      message: 'Account unlocked successfully',
    };
  }

  @Get(':id/audit-logs')
  async getAuditLogs(
    @Param('id') id: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const auditLogs = await this.auditLogsService.getAuditLogs(
      id,
      Number(page),
      Number(limit),
    );
    return {
      message: 'Get audit logs successfully',
      data: auditLogs,
    };
  }
}
