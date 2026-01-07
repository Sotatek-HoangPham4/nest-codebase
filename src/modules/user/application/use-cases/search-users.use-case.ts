import { Inject, Injectable } from '@nestjs/common';
import { type IUserRepository } from '../../domain/repositories/user.repository.interface';

@Injectable()
export class SearchUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async execute(params: { keyword: string; limit: number }) {
    const keyword = params.keyword.trim().toLowerCase();
    const limit = Math.min(Math.max(params.limit ?? 10, 1), 20);

    return this.userRepo.searchByEmailOrUsername(keyword, limit);
  }
}
