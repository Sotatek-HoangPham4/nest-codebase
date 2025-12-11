export interface IAuthRepository {
  saveMfaSecret(userId: string, secret: string): Promise<void>;
  getMfaSecret(userId: string): Promise<string | null>;
}
