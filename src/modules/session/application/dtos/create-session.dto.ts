export class CreateSessionDto {
  userId: string;
  device: string;
  ipAddress: string;
  userAgent: string;
  refreshTokenHash: string;
}
