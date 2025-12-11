import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sendgrid from '@sendgrid/mail';

@Injectable()
export class SendGridEmailService {
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('notification.sendgridKey');
    const from = this.config.get<string>('notification.sendgridFrom');

    if (!apiKey) {
      throw new Error('SENDGRID_KEY is missing');
    }
    if (!from) {
      throw new Error('SENDGRID_FROM is missing');
    }

    sendgrid.setApiKey(apiKey);
    this.from = from;
  }

  async sendMail(to: string, subject: string, content: string) {
    await sendgrid.send({
      to,
      from: this.from,
      subject,
      text: content,
    });
  }
}
