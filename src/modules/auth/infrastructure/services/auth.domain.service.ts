import ms from 'ms';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IAuthService } from '../../domain/services/auth.domain.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  private readonly saltRounds = 10;
  private readonly accessTTL: number;
  private readonly refreshTTL: number;

  constructor(private readonly jwtService: JwtService) {
    ((this.accessTTL = parseInt(process.env.ACCESS_TOKEN_TTL!, 10) ?? 900),
      (this.refreshTTL =
        parseInt(process.env.REFRESH_TOKEN_TTL!, 10) ?? 604800));
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async comparePasswords(
    rawPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(rawPassword, hashedPassword);
  }

  async hashToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload as object, {
      expiresIn: this.accessTTL as number,
    });
  }

  generateRefreshToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload as object, {
      expiresIn: this.refreshTTL as number,
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token);
  }

  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token);
  }
}
