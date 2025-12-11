export interface ISmsService {
  sendSms(to: string, message: string): Promise<void>;
}

export const ISmsServiceToken = 'ISmsService';
