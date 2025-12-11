import { Inject, Injectable } from '@nestjs/common';
import {
  type ISmsService,
  ISmsServiceToken,
} from '../../domain/services/sms.service.interface';
import { SendSmsDto } from '../dtos/send-sms.dto';

@Injectable()
export class SendSmsUseCase {
  constructor(
    @Inject(ISmsServiceToken)
    private readonly smsService: ISmsService,
  ) {}

  async execute(dto: SendSmsDto) {
    await this.smsService.sendSms(dto.to, dto.message);
    return { message: 'SMS sent.' };
  }
}
