import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { ScheduleService } from '../application/services/schedule.service';

@Injectable()
export class CleanupTask {
  private readonly logger = new Logger(CleanupTask.name);

  constructor(private readonly scheduleService: ScheduleService) {}

  // run every 10 minutes
  @Interval(10 * 60 * 1000)
  async handleInterval() {
    this.logger.debug('Running periodic cleanup check');
    // enqueue a cleanup job (dedupe using jobId if necessary)
    await this.scheduleService.enqueueCleanup({ olderThanDays: 30 });
  }
}
