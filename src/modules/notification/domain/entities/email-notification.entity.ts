export class EmailNotification {
  constructor(
    public readonly to: string,
    public readonly subject: string,
    public readonly content: string,
  ) {}
}
