import { Inject, Injectable } from '@nestjs/common';
import { type IUserRepository } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.vo';

@Injectable()
export class FindUserByEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(email: string) {
    const normalized = email.trim().toLowerCase();

    const emailVO = new Email(normalized);

    return this.userRepo.findByEmail(emailVO);
  }
}
