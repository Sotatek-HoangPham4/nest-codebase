import { User } from '@/modules/user/domain/entities/user.entity';

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(raw: string, hashed: string): Promise<boolean>;

  hashToken(token: string): Promise<string>;

  generateAccessToken(payload: any): string;
  generateRefreshToken(payload: any): string;

  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
}
