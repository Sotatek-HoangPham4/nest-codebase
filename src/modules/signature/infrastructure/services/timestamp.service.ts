export class TimestampService {
  nowIso(): string {
    return new Date().toISOString();
  }
}
