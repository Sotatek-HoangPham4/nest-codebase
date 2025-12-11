import {
  Injectable,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common';
import { AuthService } from '../../infrastructure/services/auth.domain.service';
import type { ISessionRepository } from '@/modules/session/domain/repositories/session.repository.interface';
import { normalizeIp, normalizeUserAgent } from '@/shared/utils/normalize';

/**
 * RefreshUseCase
 *
 * Responsibilities:
 *  - Validate session
 *  - Verify refresh token signature
 *  - Detect refresh token reuse attack
 *  - Check device/IP/User-Agent integrity
 *  - Perform refresh-token rotation (rotating token pattern)
 *  - Issue new access & refresh tokens
 *
 * NOTE: This use case contains ONLY business logic & security rules.
 *       No HTTP, cookies, or framework-specific logic here.
 */
@Injectable()
export class RefreshUseCase {
  private readonly logger = new Logger(RefreshUseCase.name);

  constructor(
    /**
     * AuthService is injected through the token "IAuthService"
     * So module must include:
     *   { provide: 'IAuthService', useClass: AuthService }
     */
    @Inject('IAuthService')
    private readonly authService: AuthService,

    @Inject('ISessionRepository')
    private readonly sessionRepo: ISessionRepository,
  ) {}

  /**
   * Refresh Token Rotation Flow
   * Input: sessionId + refreshToken + device metadata
   * Output: new access token + rotated refresh token
   */
  async execute(dto: {
    ip: string;
    userAgent: string;
    sessionId: string;
    refreshToken: string;
  }): Promise<{ accessToken: string; newRefreshToken: string }> {
    const { ip, userAgent, sessionId, refreshToken } = dto;

    // ------------------------------------------------------------
    // 1. Load session from persistence (Redis / DB)
    // ------------------------------------------------------------
    const session = await this.sessionRepo.findById(sessionId);
    if (!session) {
      this.logger.warn(`Session not found: ${sessionId}`);
      throw new UnauthorizedException('Invalid session');
    }

    // Session already revoked → block request
    if (session.isRevoked) {
      this.logger.warn(`Session already revoked: ${sessionId}`);
      throw new UnauthorizedException('Session revoked');
    }

    // Missing_RT is also treated as compromised
    if (!refreshToken) {
      this.logger.warn(`Missing refresh token for session ${sessionId}`);
      await this.sessionRepo.revokeSession(sessionId);
      throw new UnauthorizedException('Missing refresh token');
    }

    // ------------------------------------------------------------
    // 2. Verify refresh token signature
    // ------------------------------------------------------------
    let payload;
    try {
      payload = await this.authService.verifyRefreshToken(refreshToken);
    } catch (err) {
      this.logger.warn(
        `Refresh token verification failed for session ${sessionId}. Reason: ${err.message}`,
      );

      // When signature fails → the token is invalid or tampered → revoke session
      await this.sessionRepo.revokeSession(sessionId);
      throw new UnauthorizedException(
        'Signature fails! The token is invalid or tampered',
      );
    }

    // ------------------------------------------------------------
    // 3. Compare hashed refresh token to detect REUSE attack
    // ------------------------------------------------------------
    const isTokenMatch = await this.authService.comparePasswords(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isTokenMatch) {
      /**
       * Critical security event:
       * Someone is trying to reuse an old refresh token (stolen token)
       * → Immediately revoke the whole session
       */
      this.logger.error(
        `Refresh token mismatch for session ${sessionId}. Possible REUSE attack.`,
      );

      await this.sessionRepo.revokeSession(sessionId);
      throw new UnauthorizedException('Invalid refresh token');
    }

    // ------------------------------------------------------------
    // 4. Device Integrity Check (IP + User-Agent binding)
    // ------------------------------------------------------------
    // Normalize before comparing
    let normalizedIp = normalizeIp(ip);
    let normalizedUa = normalizeUserAgent(userAgent);

    let sessionIp = normalizeIp(session.ipAddress);
    let sessionUa = normalizeUserAgent(session.userAgent);

    if (sessionIp !== normalizedIp || sessionUa !== normalizedUa) {
      console.log({ normalizedIp, normalizedUa });

      this.logger.error(
        `Device mismatch for session ${sessionId}. IP/UA changed → possible token replay.`,
      );

      await this.sessionRepo.revokeSession(sessionId);
      throw new UnauthorizedException('Suspicious activity');
    }

    // ------------------------------------------------------------
    // 5. Anti-spam throttling (OPTIONAL but recommended)
    //
    // Prevents bot scripts from spamming refresh requests.
    // Recommended cooldown: 1500–2000 ms
    // ------------------------------------------------------------
    const now = Date.now();
    if (now - session.lastUsedAt < 2000) {
      await this.sessionRepo.revokeSession(sessionId);
      throw new UnauthorizedException('Suspicious refresh attempts');
    }

    session.touchLastUsedAt();
    await this.sessionRepo.update(session);

    // ------------------------------------------------------------
    // 6. ROTATION → generate fresh refresh token (rotating token pattern)
    // ------------------------------------------------------------
    const newRefreshToken = await this.authService.generateRefreshToken({
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    });

    const hashedNewRT = await this.authService.hashPassword(newRefreshToken);

    // Update session with rotated hash
    session.rotateRefreshToken(hashedNewRT);
    await this.sessionRepo.update(session);

    // ------------------------------------------------------------
    // 7. Issue new access token
    // ------------------------------------------------------------
    const accessToken = await this.authService.generateAccessToken({
      sub: payload.sub,
      username: payload.username,
      role: payload.role,
    });

    return { accessToken, newRefreshToken };
  }
}
