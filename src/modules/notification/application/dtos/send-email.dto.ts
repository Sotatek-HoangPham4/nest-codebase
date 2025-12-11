export class SendEmailDto {
  to: string;
  subject: string;
  template?: string;
  html?: string;
  text?: string;
}
