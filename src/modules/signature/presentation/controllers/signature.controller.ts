import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { SignRequestDto } from '../../application/dtos/sign-request.dto';
import { VerifyRequestDto } from '../../application/dtos/verify-request.dto';

import { SignDocumentUseCase } from '../../application/use-cases/sign-document.use-case';
import { VerifySignatureUseCase } from '../../application/use-cases/verify-signature.use-case';
import { MultiSignUseCase } from '../../application/use-cases/multi-sign.use-case';

import { SignatureResponseDto } from '../dtos/signature-response.dto';
import { PublicVerifySignatureUseCase } from '../../application/use-cases/public-verify-signature.use-case';
import { CurrentUser } from '@/shared/decorators/current-user.decorator';
import { AuthGuard } from '@/modules/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('signature')
export class SignatureController {
  constructor(
    private readonly signUseCase: SignDocumentUseCase,
    private readonly verifyUseCase: VerifySignatureUseCase,
    private readonly multiSignUseCase: MultiSignUseCase,
    private readonly publicVerifyUseCase: PublicVerifySignatureUseCase,
  ) {}

  /**
   * MVP SIGN:
   * - dto: {documentId, signerId, index, otpToken, versionNumber?}
   * - server tự load PDF từ documents.versions.filePath, ký, tạo version mới, update signatures + notify
   */
  @Post('sign')
  async sign(@Body() dto: SignRequestDto, @CurrentUser() user: { id: string }) {
    try {
      const res = await this.signUseCase.execute({ ...dto, signerId: user.id });
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(e.message ?? 'Sign failed');
    }
  }

  /**
   * Internal verify:
   * - dto: {documentId, versionNumber?}
   * - server load file version, verify hash + crypto
   */
  @Post('verify')
  async verify(@Body() dto: VerifyRequestDto) {
    try {
      const res = await this.verifyUseCase.execute(dto);
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(e.message ?? 'Verify failed');
    }
  }

  /**
   * Public verify by QR:
   * - GET /signature/public-verify?signatureId=...
   * - trả log ký + kết quả hash match
   */
  @Get('public-verify')
  async publicVerify(@Query('signatureId') signatureId: string) {
    try {
      const res = await this.publicVerifyUseCase.execute({ signatureId });
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(e.message ?? 'Public verify failed');
    }
  }

  /**
   * MVP: multi-sign có thể giữ để test nhanh.
   * Lưu ý: nên ký tuần tự => mỗi lần ký tạo version mới, lần tiếp theo ký lên version mới nhất.
   */
  @Post('multi-sign')
  async multiSign(@Body() dtos: SignRequestDto[]) {
    try {
      const res = await this.multiSignUseCase.execute(dtos);
      return SignatureResponseDto.ok(res);
    } catch (e: any) {
      return SignatureResponseDto.fail(e.message ?? 'Multi-sign failed');
    }
  }
}
