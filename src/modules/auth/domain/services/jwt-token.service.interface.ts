export interface IJwtTokenService {
  hashToken(token: string): Promise<string>;

  generateAccessToken(payload: any): string;
  generateRefreshToken(payload: any): string;

  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
}
