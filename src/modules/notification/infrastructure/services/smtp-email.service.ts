import * as nodemailer from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { IEmailService } from '../../domain/services/email.service.interface';

@Injectable()
export class SmtpEmailService implements IEmailService {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendEmail({ to, subject, html }) {
    await this.transporter.sendMail({
      to,
      subject,
      html,
      from: process.env.SMTP_FROM,
    });
  }
}
