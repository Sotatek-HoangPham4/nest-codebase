import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto) {
    const email = new Email(dto.email);

    const user = User.create({
      username: dto.username,
      fullname: dto.fullname,
      email,
      password: dto.password,
      phone_number: dto.phone_number,
      avatar_url: dto.avatar_url,
      provider: dto.provider || 'local',
      role: dto.role || 'user',
    });

    return this.userRepo.create(user);
  }
}
