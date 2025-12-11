import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ScheduleService } from '../application/services/schedule.service';

@Injectable()
export class DailyReportTask {
  private readonly logger = new Logger(DailyReportTask.name);

  constructor(private readonly scheduleService: ScheduleService) {}

  /**
   * Run every day at 01:00 (server local time).
   * Use CronExpression or custom cron string.
   */
  @Cron(CronExpression.EVERY_DAY_AT_1AM, {
    name: 'daily-report-cron',
  })
  async handleCron() {
    this.logger.log('Daily report cron triggered');
    // Example: enqueue email job to send daily reports
    await this.scheduleService.enqueueEmail({
      to: 'team@example.com',
      subject: 'Daily Report',
      template: 'daily-report',
      context: { date: new Date().toISOString() },
    });
  }
}
