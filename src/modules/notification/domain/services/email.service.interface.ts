export interface IEmailService {
  sendEmail(payload: {
    to: string;
    subject: string;
    html: string;
  }): Promise<void>;
}

export const IEmailServiceToken = 'IEmailService';
