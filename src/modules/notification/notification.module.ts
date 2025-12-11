import { Module } from '@nestjs/common';
import { NotificationController } from './presentation/controllers/notification.controller';
import { SendEmailUseCase } from './application/use-cases/send-email.use-case';
import { SendSmsUseCase } from './application/use-cases/send-sms.use-case';
import { SendPushNotificationUseCase } from './application/use-cases/send-push.use-case';
import { SendWebhookUseCase } from './application/use-cases/send-webhook.use-case';
import { IEmailServiceToken } from './domain/services/email.service.interface';
import { SmtpEmailService } from './infrastructure/services/smtp-email.service';
import { ISmsServiceToken } from './domain/services/sms.service.interface';
import { TwilioSmsService } from './infrastructure/services/twilio-sms.service';
import { IPushServiceToken } from './domain/services/push.service.interface';
import { FcmPushService } from './infrastructure/services/fcm-push.service';
import { IWebhookServiceToken } from './domain/services/webhook.service.interface';
import { WebhookCallbackService } from './infrastructure/services/webhook-callback.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [
    // Use Cases
    SendEmailUseCase,
    SendSmsUseCase,
    SendPushNotificationUseCase,
    SendWebhookUseCase,

    // Services (Infrastructure)
    { provide: IEmailServiceToken, useClass: SmtpEmailService },
    // OR use SendGrid
    // { provide: IEmailServiceToken, useClass: SendGridEmailService },

    { provide: ISmsServiceToken, useClass: TwilioSmsService },
    { provide: IPushServiceToken, useClass: FcmPushService },
    { provide: IWebhookServiceToken, useClass: WebhookCallbackService },
  ],
})
export class NotificationModule {}
