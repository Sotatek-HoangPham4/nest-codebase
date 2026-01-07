import type { Request, Response } from 'express';
import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  Get,
  UseGuards,
} from '@nestjs/common';
import { RegisterDto } from '../../application/dtos/register.dto';
import { LoginDto } from '../../application/dtos/login.dto';
import { clearAuthCookies, setAuthCookies } from '@/shared/utils/cookies';
import { VerifyOtpDto } from '../../application/dtos/verify-otp.dto';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { RefreshUseCase } from '../../application/use-cases/refresh.use-case';
import { EnableMfaUseCase } from '../../application/use-cases/enable-mfa.use-case';
import { VerifyOtpUseCase } from '../../application/use-cases/verify-otp.use-case';
import { GetMeUseCase } from '../../application/use-cases/get-me.use-case';
import { AuthGuard } from '../../guards/auth.guard';
import { UserMapper } from '@/modules/user/infrastructure/mappers/user.mapper';
import { UserResponseDto } from '@/modules/user/presentation/dtos/user-response.dto';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshUseCase: RefreshUseCase,
    private readonly enableMfaUseCase: EnableMfaUseCase,
    private readonly verifyOtpUseCase: VerifyOtpUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const user = await this.registerUseCase.execute(dto);
    return {
      message: 'User registered successfully',
      data: user,
    };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, sessionId, refreshToken } =
      await this.loginUseCase.execute(dto, req);

    setAuthCookies({ res, sessionId, refreshToken });

    return {
      message: 'User login successfully',
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
    };
  }

  @Get('me')
  // @UseGuards(AuthGuard)
  async me(@Req() req: AuthenticatedRequest) {
    const userId = '0b15a950-2929-4f84-b68a-90f33e78a4e8';

    const user = await this.getMeUseCase.execute(userId);

    return {
      message: 'Get current user successfully',
      data: UserResponseDto.toResponse(user),
    };
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const sessionId = req.cookies['sessionId'];

    if (sessionId) {
      await this.logoutUseCase.execute(sessionId);
    }

    clearAuthCookies({ res });

    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = req.cookies['sessionId'];
    const refreshToken = req.cookies['refreshToken'];

    const ip = req.ip!;
    const userAgent = req.headers['user-agent'] || 'unknown';

    const { accessToken, newRefreshToken } = await this.refreshUseCase.execute({
      ip,
      userAgent,
      sessionId,
      refreshToken,
    });

    setAuthCookies({ res, sessionId, refreshToken: newRefreshToken });

    return {
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    };
  }

  @Post('mfa/enable')
  async enableMfa(@Body('userId') userId: string) {
    const secret = await this.enableMfaUseCase.execute(userId);
    return {
      message: 'MFA enabled successfully. Use the OTP code to verify.',
      data: secret,
    };
  }

  @Post('mfa/verify')
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    this.verifyOtpUseCase.execute(dto.userId, dto.otp);
    return {
      message: 'OTP code verified successfully. MFA is now active.',
    };
  }
}
