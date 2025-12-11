import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { LoginDto, LoginResponseDto } from '../dtos/login.dto';
import { Email } from '@/modules/user/domain/value-objects/email.vo';
import { normalizeIp, normalizeUserAgent } from '@/shared/utils/normalize';

import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';
import type { ISessionRepository } from '@/modules/session/domain/repositories/session.repository.interface';
import { CreateSessionDto } from '@/modules/session/application/dtos/create-session.dto';
import { Session } from '@/modules/session/domain/entities/session.entity';
import type { IAuthService } from '../../domain/services/auth.domain.service.interface';

@Injectable()
export class LoginUseCase {
  private readonly logger = new Logger(LoginUseCase.name);

  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,

    @Inject('IAuthService')
    private readonly authService: IAuthService,

    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  /**
   * LoginUseCase (Single Responsibility Principle)
   *
   * Responsibilities:
   *  1. Validate user credentials.
   *  2. Issue access & refresh tokens.
   *  3. Create session with device/IP/User-Agent metadata.
   *
   * Notes:
   *  - This use case does not handle HTTP/Express concerns like cookies or headers.
   *  - All security logic (hashing, token generation) is delegated to IAuthService.
   *  - Repository interfaces (IUserRepository / ISessionRepository) abstract persistence.
   *
   * @param dto Login DTO (email + password)
   * @param req Express request (for device/IP/User-Agent)
   * @returns LoginResponseDto containing accessToken, refreshToken, sessionId
   */
  async execute(dto: LoginDto, req: Request): Promise<LoginResponseDto> {
    // -------------------------
    // 1. Validate user credentials (SRP, Single Responsibility)
    // -------------------------
    const emailVo = new Email(dto.email); // Value Object pattern: encapsulate email validation

    const user = await this.userRepo.findByEmail(emailVo);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await this.authService.comparePasswords(
      dto.password,
      user.password,
    );
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    // -------------------------
    // 2. Generate JWTs (Delegation, Open/Closed Principle)
    // -------------------------
    const payload = { sub: user.id, username: user.username, role: user.role };

    const accessToken = this.authService.generateAccessToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);

    const hashedRefreshToken = await this.authService.hashToken(refreshToken);

    // -------------------------
    // 3. Extract and normalize device/IP/User-Agent (Single Responsibility)
    // -------------------------
    const device = req.headers['user-agent'] ?? 'desktop';

    let ip = Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'][0]
      : req.headers['x-forwarded-for'] || req.ip;
    ip = normalizeIp(ip!); // normalize IPv4/IPv6 for reliable comparison

    const userAgent = normalizeUserAgent(req.headers['user-agent'] ?? '');

    // -------------------------
    // 4. Create session entity (SRP + Liskov Substitution)
    // -------------------------
    const createDto: CreateSessionDto = {
      userId: user.id!,
      device: device,
      ipAddress: ip,
      userAgent: userAgent,
      refreshTokenHash: hashedRefreshToken,
    };

    const session = await this.sessionRepo.create(
      Session.create({
        userId: createDto.userId,
        device: createDto.device,
        ipAddress: createDto.ipAddress,
        userAgent: createDto.userAgent,
        refreshTokenHash: createDto.refreshTokenHash,
        lastUsedAt: Date.now(), // timestamp in milliseconds
      }),
    );

    this.logger.log(`Created session ${session.id} for user ${user.id}`);

    // -------------------------
    // 5. Return login response (Dependency Inversion: API layer decides HTTP/cookie handling)
    // -------------------------
    return {
      sessionId: session.id!,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
}
