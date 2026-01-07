// modules/document/presentation/controllers/document-signing.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { DeploySigningDto } from '../dtos/deploy-signing.dto';
import { DeploySigningUseCase } from '../../application/use-cases/deploy-signing.usecase';
import { GetSigningSessionUseCase } from '../../application/use-cases/get-signing-session.usecase';
import { CancelSigningUseCase } from '../../application/use-cases/cancel-signing.usecase';

@UseGuards(AuthGuard)
@Controller('documents')
export class DocumentSigningController {
  constructor(
    private readonly deployUc: DeploySigningUseCase,
    private readonly sessionUc: GetSigningSessionUseCase,
    private readonly cancelUc: CancelSigningUseCase,
  ) {}

  @Post(':id/deploy-signing')
  deploy(
    @Param('id') documentId: string,
    @Body() dto: DeploySigningDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.deployUc.execute({ documentId, actorId: user.id, ...dto });
  }

  @Get(':id/signing/session')
  session(
    @Param('id') documentId: string,
    @CurrentUser() user: { id: string },
    @Query('signerId') signerId?: string, // optional; default = current user
  ) {
    return this.sessionUc.execute({
      documentId,
      viewerId: user.id,
      signerId: signerId ?? user.id,
    });
  }

  @Post(':id/cancel-signing')
  cancel(@Param('id') documentId: string, @CurrentUser() user: { id: string }) {
    return this.cancelUc.execute({ documentId, actorId: user.id });
  }
}
