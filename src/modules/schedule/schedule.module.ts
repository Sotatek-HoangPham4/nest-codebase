import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import scheduleConfig from './schedule.config';
import { ScheduleController } from './presentation/controllers/schedule.controller';
import { QUEUES } from './infrastructure/queues/queues.constants';
import { EmailProcessor } from './infrastructure/queues/processors/email.processor';
import { SmsProcessor } from './infrastructure/queues/processors/sms.processor';
import { CleanupProcessor } from './infrastructure/queues/processors/cleanup.processor';
import { DailyReportTask } from './tasks/daily-report.task';
import { CleanupTask } from './tasks/cleanup.task';
import { ScheduleService } from './application/services/schedule.service';

@Module({
  imports: [
    ConfigModule.forFeature(scheduleConfig),
    NestScheduleModule.forRoot(), // enable scheduler
    // configure bull with redis from config
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const redis = config.get('schedule.redis') as any;
        return {
          redis,
          // optional default job options
          defaultJobOptions: config.get('schedule.bull.defaultJobOptions'),
        };
      },
    }),
    // register named queues
    BullModule.registerQueue(
      { name: QUEUES.EMAIL },
      { name: QUEUES.SMS },
      { name: QUEUES.CLEANUP },
    ),
  ],
  controllers: [ScheduleController],
  providers: [
    ScheduleService,
    EmailProcessor,
    SmsProcessor,
    CleanupProcessor,
    DailyReportTask,
    CleanupTask,
  ],
  exports: [ScheduleService],
})
export class ScheduleModule {}
