import { Injectable, ConflictException, Inject } from '@nestjs/common';
import type { IUserRepository } from '../../../user/domain/repositories/user.repository.interface';

import { RegisterDto, RegisterResponseDto } from '../dtos/register.dto';
import { User } from '../../../user/domain/entities/user.entity';
import { Email } from '../../../user/domain/value-objects/email.vo';
import { Password } from '@/modules/user/domain/value-objects/password.vo';
import type { IAuthService } from '../../domain/services/auth.domain.service.interface';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    @Inject('IAuthService')
    private readonly authService: IAuthService,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResponseDto> {
    const emailVo = new Email(dto.email);
    const forbiddenWords = [dto.username, dto.fullname];
    const passwordVo = Password.create(dto.password, forbiddenWords);

    const existing = await this.userRepo.findByEmail(emailVo);
    if (existing) throw new ConflictException('User already exists');

    const existingUsername = await this.userRepo.findByUsername(dto.username);
    if (existingUsername)
      throw new ConflictException('Username already exists');

    const hashed = await this.authService.hashPassword(passwordVo.getValue());

    const user = User.create({
      username: dto.username,
      fullname: dto.fullname,
      email: new Email(dto.email),
      password: hashed,
      provider: dto.provider ?? 'local',
      role: 'user',
    });

    const createdUser = await this.userRepo.create(user);

    return new RegisterResponseDto({
      id: createdUser.id!,
      username: createdUser.username,
      fullname: createdUser.fullname,
      email: createdUser.email.getValue(),
    });
  }
}
