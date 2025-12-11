import { Session } from '../entities/session.entity';

export interface ISessionRepository {
  create(session: Session): Promise<Session>;

  findById(id: string): Promise<Session | null>;
  findByUserId(userId: string): Promise<Session[]>;
  findByIdAndUser(id: string, userId: string): Promise<Session | null>;
  findActiveById(id: string): Promise<Session | null>;

  update(session: Session): Promise<Session>;

  revokeSession(id: string): Promise<void>;
  revokeAllSessions(userId: string): Promise<void>;
}
