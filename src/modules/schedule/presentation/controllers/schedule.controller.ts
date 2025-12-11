// src/modules/schedule/presentation/controllers/schedule.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { ScheduleService } from '../../application/services/schedule.service';

@Controller('api/v1/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('email')
  async sendEmail(
    @Body()
    dto: {
      to: string;
      subject: string;
      html?: string;
      delayMs?: number;
    },
  ) {
    const job = await this.scheduleService.enqueueEmail(
      { to: dto.to, subject: dto.subject, html: dto.html },
      dto.delayMs ? { delay: dto.delayMs } : {},
    );
    return { message: 'email enqueued', jobId: job.id };
  }

  @Post('sms')
  async sendSms(
    @Body() dto: { to: string; message: string; delayMs?: number },
  ) {
    const job = await this.scheduleService.enqueueSms(
      { to: dto.to, message: dto.message },
      dto.delayMs ? { delay: dto.delayMs } : {},
    );
    return { message: 'sms enqueued', jobId: job.id };
  }

  @Post('cleanup')
  async enqueueCleanup(@Body() dto: { olderThanDays: number }) {
    const job = await this.scheduleService.enqueueCleanup({
      olderThanDays: dto.olderThanDays,
    });
    return { message: 'cleanup enqueued', jobId: job.id };
  }
}
