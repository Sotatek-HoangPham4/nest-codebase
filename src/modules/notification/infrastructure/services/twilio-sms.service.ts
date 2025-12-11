import { Twilio } from 'twilio';

import { Injectable } from '@nestjs/common';
import { ISmsService } from '../../domain/services/sms.service.interface';

@Injectable()
export class TwilioSmsService implements ISmsService {
  private client = new Twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

  async sendSms(to: string, message: string) {
    await this.client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE,
    });
  }
}
