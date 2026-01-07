import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserSignatureDto } from '../../application/dtos/create-user-signature.dto';
import { CreateUserSignatureUseCase } from '../../application/use-cases/create-user-signature.use-case';
import { DeleteUserSignatureUseCase } from '../../application/use-cases/delete-user-signature.use-case';
import { RecreateUserSignatureUseCase } from '../../application/use-cases/recreate-user-signature.use-case';

import { SignatureResponseDto } from '../dtos/signature-response.dto';
import { GetUserSignatureUseCase } from '../../application/use-cases/get-user-signature.use-case';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('signature/profile')
export class UserSignatureController {
  constructor(
    private readonly createUc: CreateUserSignatureUseCase,
    private readonly deleteUc: DeleteUserSignatureUseCase,
    private readonly recreateUc: RecreateUserSignatureUseCase,
    private readonly getUc: GetUserSignatureUseCase,
  ) {}

  // GET /signature/profile?userId=...
  @Get()
  async get(@Query('userId') userId: string) {
    try {
      const res = await this.getUc.execute(userId);
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(e.message ?? 'Get signature failed');
    }
  }

  // POST /signature/profile
  @Post()
  async create(
    @Body() dto: CreateUserSignatureDto,
    @CurrentUser() user: { id: string },
  ) {
    try {
      const res = await this.createUc.execute(dto, user.id);
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(e.message ?? 'Create signature failed');
    }
  }

  // DELETE /signature/profile?userId=...
  @Delete()
  async remove(@Query('userId') userId: string) {
    try {
      const res = await this.deleteUc.execute(userId);
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(e.message ?? 'Delete signature failed');
    }
  }

  // POST /signature/profile/recreate
  @Post('recreate')
  async recreate(
    @Body() dto: CreateUserSignatureDto,
    @CurrentUser() user: { id: string },
  ) {
    try {
      const res = await this.recreateUc.execute(dto, user.id);
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(
        e.message ?? 'Recreate signature failed',
      );
    }
  }
}
