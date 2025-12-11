import { Processor, Process } from '@nestjs/bull';
import type { Queue, Job } from 'bull';
import { QUEUES } from '../queues.constants';
import { Injectable, Logger } from '@nestjs/common';

@Processor(QUEUES.CLEANUP)
@Injectable()
export class CleanupProcessor {
  private readonly logger = new Logger(CleanupProcessor.name);

  @Process()
  async handleCleanup(job: Job) {
    const { olderThanDays } = job.data;
    this.logger.log(`Start cleanup job olderThanDays=${olderThanDays}`);
    // TODO: call repository or service to cleanup old records/files
    return { cleaned: true };
  }
}
