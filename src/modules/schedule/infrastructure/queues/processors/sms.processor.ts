import { Processor, Process } from '@nestjs/bull';
import type { Queue, Job } from 'bull';
import { QUEUES } from '../queues.constants';
import { Injectable, Logger } from '@nestjs/common';

@Processor(QUEUES.SMS)
@Injectable()
export class SmsProcessor {
  private readonly logger = new Logger(SmsProcessor.name);

  @Process({ concurrency: 10 })
  async handleSendSms(job: Job) {
    const payload = job.data as { to: string; message: string };
    this.logger.log(`Sending SMS to ${payload.to}`);
    try {
      // TODO send via Twilio adapter or SMS provider
      // await this.smsService.send(payload.to, payload.message);
      this.logger.log(`SMS sent to ${payload.to}`);
      return { success: true };
    } catch (err) {
      this.logger.error(`SMS job failed: ${err.message}`, err.stack);
      throw err;
    }
  }
}
