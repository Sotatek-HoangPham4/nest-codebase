import { Inject, Injectable } from '@nestjs/common';
import {
  type IWebhookService,
  IWebhookServiceToken,
} from '../../domain/services/webhook.service.interface';
import { SendWebhookDto } from '../dtos/send-webhook.dto';

@Injectable()
export class SendWebhookUseCase {
  constructor(
    @Inject(IWebhookServiceToken)
    private readonly webhookService: IWebhookService,
  ) {}

  async execute(dto: SendWebhookDto) {
    await this.webhookService.callWebhook(dto.url, dto.payload);
    return { message: 'Webhook triggered.' };
  }
}
