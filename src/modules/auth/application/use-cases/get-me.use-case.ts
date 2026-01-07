import { type IUserRepository } from '@/modules/user/domain/repositories/user.repository.interface';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(userId: string) {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
