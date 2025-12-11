import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionOrmEntity } from './infrastructure/persistence/orm/session.orm-entity';

import { CreateSessionUseCase } from './application/use-cases/create-session.use-case';
import { GetSessionUseCase } from './application/use-cases/get-session.use-case';

import { SessionController } from './presentation/controllers/session.controller';
import { GetUserSessionsUseCase } from './application/use-cases/get-user-sessions.use-case';
import { RevokeSessionUseCase } from './application/use-cases/revoke-session.use-case';
import { RevokeAllSessionsUseCase } from './application/use-cases/revoke-all-sessions.use-case';
import { SessionRepository } from './infrastructure/persistence/repositories/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionOrmEntity])],
  controllers: [SessionController],
  providers: [
    {
      provide: 'ISessionRepository',
      useClass: SessionRepository,
    },
    CreateSessionUseCase,
    GetSessionUseCase,
    GetUserSessionsUseCase,
    RevokeSessionUseCase,
    RevokeAllSessionsUseCase,
  ],
  exports: ['ISessionRepository'],
})
export class SessionModule {}
