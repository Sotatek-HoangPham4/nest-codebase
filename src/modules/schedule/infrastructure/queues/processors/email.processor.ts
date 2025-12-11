import { Processor, Process } from '@nestjs/bull';
import type { Queue, Job } from 'bull';
import { QUEUES } from '../queues.constants';
import { Injectable, Logger } from '@nestjs/common';

/**
 * Email processor handles jobs pushed to email queue.
 * It should call your EmailAdapter/service (SMTP, SendGrid, etc).
 */
@Processor(QUEUES.EMAIL)
@Injectable()
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);

  @Process({ concurrency: 5 }) // handle up to 5 jobs in parallel
  async handleSendEmail(job: Job) {
    this.logger.log(`Processing email job ${job.id} type=${job.name}`);
    try {
      const payload = job.data as {
        to: string;
        subject: string;
        template?: string;
        context?: Record<string, any>;
        html?: string;
        text?: string;
      };

      // TODO: call real email adapter injected via service (e.g., this.emailService.send)
      // Example:
      // await this.emailService.send(payload);

      this.logger.log(`Email job completed ${job.id} -> ${payload.to}`);
      return { success: true };
    } catch (err) {
      this.logger.error(
        `Email job failed ${job.id}: ${err.message}`,
        err.stack,
      );
      throw err; // rethrow => Bull will mark attempt failed and retry if attempts left
    }
  }
}
