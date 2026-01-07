import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email.vo';

export interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(user: User): Promise<User>;
  softDelete(id: string): Promise<void>;
  saveSettings(id: string, settings: Record<string, any>): Promise<void>;

  searchByEmailOrUsername(keyword: string, limit: number): Promise<User[]>;
}
