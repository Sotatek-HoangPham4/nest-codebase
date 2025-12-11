import * as admin from 'firebase-admin';

import { Injectable } from '@nestjs/common';
import { IPushService } from '../../domain/services/push.service.interface';

@Injectable()
export class FcmPushService implements IPushService {
  async sendPush(deviceToken: string, title: string, body: string) {
    await admin.messaging().send({
      token: deviceToken,
      notification: { title, body },
    });
  }
}
