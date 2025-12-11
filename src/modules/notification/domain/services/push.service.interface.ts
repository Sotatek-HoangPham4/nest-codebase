export interface IPushService {
  sendPush(deviceToken: string, title: string, body: string): Promise<void>;
}

export const IPushServiceToken = 'IPushService';
