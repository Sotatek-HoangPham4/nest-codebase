import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { GetUserUseCase } from '../use-cases/get-user.use-case';
import { UpdateUserUseCase } from '../use-cases/update-user.use-case';
import { UpdateSettingsUseCase } from '../use-cases/update-settings.use-case';

@Injectable()
export class UserService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateSettingsUseCase: UpdateSettingsUseCase,
  ) {}

  createUser(dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
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
