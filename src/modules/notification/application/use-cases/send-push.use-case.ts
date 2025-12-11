import { Inject, Injectable } from '@nestjs/common';
import {
  IPushServiceToken,
  type IPushService,
} from '../../domain/services/push.service.interface';
import { SendPushDto } from '../dtos/send-push.dto';

@Injectable()
export class SendPushNotificationUseCase {
  constructor(
    @Inject(IPushServiceToken)
    private readonly pushService: IPushService,
  ) {}

  async execute(dto: SendPushDto) {
    await this.pushService.sendPush(dto.deviceToken, dto.title, dto.body);
    return { message: 'Push notification delivered.' };
  }
}
