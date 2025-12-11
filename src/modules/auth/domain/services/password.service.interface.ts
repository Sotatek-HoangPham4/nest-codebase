export interface IPasswordService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(raw: string, hashed: string): Promise<boolean>;
}
