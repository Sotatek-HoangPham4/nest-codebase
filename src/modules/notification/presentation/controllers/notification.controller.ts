import { Controller, Get, Post, Patch, Param, Body, Req } from '@nestjs/common';

import { SendEmailUseCase } from '../../application/use-cases/send-email.use-case';
import { SendSmsUseCase } from '../../application/use-cases/send-sms.use-case';
import { SendPushNotificationUseCase } from '../../application/use-cases/send-push.use-case';
import { SendWebhookUseCase } from '../../application/use-cases/send-webhook.use-case';
import { SendEmailDto } from '../../application/dtos/send-email.dto';
import { SendSmsDto } from '../../application/dtos/send-sms.dto';
import { SendPushDto } from '../../application/dtos/send-push.dto';
import { SendWebhookDto } from '../../application/dtos/send-webhook.dto';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly emailUC: SendEmailUseCase,
    private readonly smsUC: SendSmsUseCase,
    private readonly pushUC: SendPushNotificationUseCase,
    private readonly webhookUC: SendWebhookUseCase,
  ) {}

  @Post('email')
  sendEmail(@Body() dto: SendEmailDto) {
    return this.emailUC.execute(dto);
  }

  @Post('sms')
  sendSms(@Body() dto: SendSmsDto) {
    return this.smsUC.execute(dto);
  }

  @Post('push')
  sendPush(@Body() dto: SendPushDto) {
    return this.pushUC.execute(dto);
  }

  @Post('webhook')
  sendWebhook(@Body() dto: SendWebhookDto) {
    return this.webhookUC.execute(dto);
  }
}
