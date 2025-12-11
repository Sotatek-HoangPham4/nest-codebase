export interface IAuditLogsRepository {
  logAudit(userId: string, action: string, metadata?: any): Promise<void>;
  paginateAuditLogs(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
  }>;
}
