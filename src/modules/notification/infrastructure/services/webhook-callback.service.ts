import axios from 'axios';

import { Injectable } from '@nestjs/common';
import { IWebhookService } from '../../domain/services/webhook.service.interface';

@Injectable()
export class WebhookCallbackService implements IWebhookService {
  async callWebhook(url: string, payload: any) {
    await axios.post(url, payload, { timeout: 5000 });
  }
}
