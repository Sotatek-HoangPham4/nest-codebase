import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { AuditLogOrmEntity } from '../orm/audit-logs.orm-entity';
import { IAuditLogsRepository } from '../../domain/repositories/audit-logs.repository.interface';

@Injectable()
export class AuditLogsRepository implements IAuditLogsRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,

    @InjectRepository(AuditLogOrmEntity)
    private readonly auditLogRepo: Repository<AuditLogOrmEntity>,
  ) {}

  async logAudit(userId: string, action: string, metadata?: any) {
    await this.auditLogRepo.save({
      user_id: userId,
      action,
      metadata,
      created_at: new Date(),
    });
  }

  async paginateAuditLogs(userId: string, page: number, limit: number) {
    const [data, total] = await this.auditLogRepo.findAndCount({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }
}
