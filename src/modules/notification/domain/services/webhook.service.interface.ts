export interface IWebhookService {
  callWebhook(url: string, payload: any): Promise<void>;
}
export const IWebhookServiceToken = 'IWebhookService';
