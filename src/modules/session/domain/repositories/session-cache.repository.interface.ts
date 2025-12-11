export interface ISessionCacheRepository {
  create(sessionId: string, data: any, ttlMs: number): Promise<void>;
  find(sessionId: string): Promise<any>;
  update(sessionId: string, data: any, ttlMs: number): Promise<void>;
  revoke(sessionId: string): Promise<void>;
}
