import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue, Job } from 'bull';
import { QUEUES } from '../../infrastructure/queues/queues.constants';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectQueue(QUEUES.EMAIL) private readonly emailQueue: Queue,
    @InjectQueue(QUEUES.SMS) private readonly smsQueue: Queue,
    @InjectQueue(QUEUES.CLEANUP) private readonly cleanupQueue: Queue,
  ) {}

  /**
   * Enqueue an email job
   * - supports delayed send by using jobOptions.delay
   * - jobOptions can include attempts/backoff/etc (Bull options)
   */
  async enqueueEmail(
    payload: {
      to: string;
      subject: string;
      html?: string;
      template?: string;
      context?: any;
    },
    jobOptions: Partial<import('bull').JobOptions> = {},
  ) {
    return this.emailQueue.add('send-email', payload, jobOptions);
  }

  async enqueueSms(
    payload: { to: string; message: string },
    jobOptions: Partial<import('bull').JobOptions> = {},
  ) {
    return this.smsQueue.add('send-sms', payload, jobOptions);
  }

  async enqueueCleanup(payload: { olderThanDays: number }) {
    // make sure cleanup jobs are deduplicated — use jobId based on args
    const jobId = `cleanup:${payload.olderThanDays}`;
    return this.cleanupQueue.add('cleanup', payload, {
      jobId,
      removeOnComplete: true,
    });
  }

  // convenience wrapper to schedule a delayed job (e.g. verify-email)
  async enqueueDelayed<T = any>(
    queue: Queue,
    name: string,
    payload: T,
    millisecondsDelay: number,
  ) {
    return queue.add(name, payload, {
      delay: millisecondsDelay,
      removeOnComplete: true,
    });
  }
}
