import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from './infrastructure/orm/user.orm-entity';
import { UserController } from './presentation/controllers/user.controller';
import { UserService } from './application/services/user.service';

import { GetUserUseCase } from './application/use-cases/get-user.use-case';
import { UpdateUserUseCase } from './application/use-cases/update-user.use-case';
import { UserRepository } from './infrastructure/repositories/user.repository';
import { AuditLogOrmEntity } from './infrastructure/orm/audit-logs.orm-entity';
import { AuditLogsService } from './application/services/audit-logs.service';
import { LockAccountUseCase } from './application/use-cases/lock-account.use-case';
import { UnlockAccountUseCase } from './application/use-cases/unlock-account.use-case';
import { GetAuditLogsUseCase } from './application/use-cases/get-audit-logs.use-case';
import { UpdateSettingsUseCase } from './application/use-cases/update-settings.use-case';
import { AuditLogsController } from './presentation/controllers/audit-logs.controller';
import { AuditLogsRepository } from './infrastructure/repositories/audit-logs.repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity, AuditLogOrmEntity])],
  controllers: [UserController, AuditLogsController],
  providers: [
    UserService,
    AuditLogsService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'IAuditLogsRepository',
      useClass: AuditLogsRepository,
    },
    CreateUserUseCase,
    GetUserUseCase,
    UpdateUserUseCase,
    UpdateSettingsUseCase,
    LockAccountUseCase,
    UnlockAccountUseCase,
    GetAuditLogsUseCase,
  ],
  exports: ['IUserRepository', 'IAuditLogsRepository'],
})
export class UserModule {}
