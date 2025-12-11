import { Inject, Injectable } from '@nestjs/common';
import {
  type IEmailService,
  IEmailServiceToken,
} from '../../domain/services/email.service.interface';
import { SendEmailDto } from '../dtos/send-email.dto';

@Injectable()
export class SendEmailUseCase {
  constructor(
    @Inject(IEmailServiceToken)
    private readonly emailService: IEmailService,
  ) {}

  async execute(dto: SendEmailDto) {
    await this.emailService.sendEmail({
      to: dto.to,
      subject: dto.subject,
      html: dto.html!,
    });

    return { message: 'Email sent successfully.' };
  }
}
