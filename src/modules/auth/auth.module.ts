import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthService } from './infrastructure/services/auth.domain.service';
import { SessionModule } from '../session/session.module';
import { RefreshUseCase } from './application/use-cases/refresh.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';
import { VerifyOtpUseCase } from './application/use-cases/verify-otp.use-case';
import { EnableMfaUseCase } from './application/use-cases/enable-mfa.use-case';

import { MfaService } from './infrastructure/services/mfa.service';
import { UserRepository } from '../user/infrastructure/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from './infrastructure/persistence/repositories/auth.repository';

@Module({
  imports: [
    UserModule,
    SessionModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'replace_me',
    }),
  ],
  controllers: [AuthController],
  providers: [
    MfaService,
    AuthService,

    AuthRepository,
    {
      provide: 'IAuthService',
      useExisting: AuthService,
    },
    {
      provide: 'IAuthRepository',
      useExisting: AuthRepository,
    },
    {
      provide: 'IMfaService',
      useExisting: MfaService,
    },
    RegisterUseCase,
    LoginUseCase,
    LogoutUseCase,
    RefreshUseCase,
    EnableMfaUseCase,
    VerifyOtpUseCase,
  ],
  // exports: ['IAuthService', 'IAuthRepository'],
})
export class AuthModule {}
