import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UpdateSettingsUseCase } from '../use-cases/update-settings.use-case';
import { FindUserByEmailUseCase } from '../use-cases/find-user-by-email.use-case';
import { SearchUsersUseCase } from '../use-cases/search-users.use-case';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateSettingsUseCase: UpdateSettingsUseCase,
    private readonly findUserByEmailUseCase: FindUserByEmailUseCase,
    private readonly searchUsersUseCase: SearchUsersUseCase,
  ) {}

  createUser(dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  async findByEmail(email: string) {
    const normalized = email.trim().toLowerCase();
    return this.findUserByEmailUseCase.execute(normalized);
  }

  searchUsers(keyword: string, limit = 10) {
    return this.searchUsersUseCase.execute({ keyword, limit });
  }

  getUser(id: string) {
    return this.getUserUseCase.execute(id);
  }

  updateUser(id: string, payload: any) {
    return this.updateUserUseCase.execute(id, payload);
  }

  updateSetting(id: string, settings: Record<string, any>) {
    return this.updateSettingsUseCase.execute(id, settings);
  }
}
