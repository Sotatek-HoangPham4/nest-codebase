import { Injectable } from '@nestjs/common';
import { CreateUserSignatureUseCase } from './create-user-signature.use-case';
import { DeleteUserSignatureUseCase } from './delete-user-signature.use-case';
import { CreateUserSignatureDto } from '../dtos/create-user-signature.dto';
import { UserSignatureResponseDto } from '../dtos/user-signature-response.dto';

@Injectable()
export class RecreateUserSignatureUseCase {
  constructor(
    private readonly deleteUc: DeleteUserSignatureUseCase,
    private readonly createUc: CreateUserSignatureUseCase,
  ) {}

  async execute(
    dto: CreateUserSignatureDto,
    userId: string,
  ): Promise<UserSignatureResponseDto> {
    // nếu có thì revoke
    try {
      await this.deleteUc.execute(userId);
    } catch {
      // ignore if none
    }
    // tạo mới
    return this.createUc.execute(dto, userId);
  }
}
