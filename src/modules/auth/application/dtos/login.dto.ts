export class LoginDto {
  email: string;
  password: string;
  device?: string;
  userAgent?: string;
  ipAddress?: string;
}

export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}
