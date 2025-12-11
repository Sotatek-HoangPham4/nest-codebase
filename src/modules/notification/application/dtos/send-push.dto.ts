export class SendPushDto {
  deviceToken: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}
