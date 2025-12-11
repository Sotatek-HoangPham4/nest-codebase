import { Controller, Post, Get, Param, Body, Patch, Req } from '@nestjs/common';
import { CreateSessionDto } from '../../application/dtos/create-session.dto';
import type { Request } from 'express';
import { SessionResponseDto } from '../dtos/session-response.dto';
import { CreateSessionUseCase } from '../../application/use-cases/create-session.use-case';
import { GetSessionUseCase } from '../../application/use-cases/get-session.use-case';
import { GetUserSessionsUseCase } from '../../application/use-cases/get-user-sessions.use-case';
import { RevokeSessionUseCase } from '../../application/use-cases/revoke-session.use-case';
import { RevokeAllSessionsUseCase } from '../../application/use-cases/revoke-all-sessions.use-case';

@Controller('sessions')
export class SessionController {
  constructor(
    private readonly createSessionUseCase: CreateSessionUseCase,
    private readonly getSessionUseCase: GetSessionUseCase,
    private readonly getUserSessionsUseCase: GetUserSessionsUseCase,
    private readonly revokeSessionUseCase: RevokeSessionUseCase,
    private readonly revokeAllSessionsUseCase: RevokeAllSessionsUseCase,
  ) {}

  /** Create new session (login) */
  @Post()
  async create(@Body() dto: CreateSessionDto) {
    const session = await this.createSessionUseCase.execute(dto);
    return {
      message: 'Session created successfully',
      data: SessionResponseDto.toResponse(session),
    };
  }

  /** Get current session via cookie/token */
  @Get('me')
  async getCurrent(@Req() req: Request) {
    const sessionId = req.cookies['sessionId'];
    const session = await this.getSessionUseCase.execute(sessionId);

    return {
      message: 'Get current session successfully',
      data: SessionResponseDto.toResponse(session!),
    };
  }

  /** Get session by explicit ID */
  @Get(':id')
  async getById(@Param('id') id: string) {
    const session = await this.getSessionUseCase.execute(id);
    return {
      message: 'Get session successfully',
      data: SessionResponseDto.toResponse(session!),
    };
  }

  /** List all sessions for a specific user */
  @Get('/user/:userId')
  async getByUserId(@Param('userId') userId: string) {
    const sessions = await this.getUserSessionsUseCase.execute(userId);
    return {
      message: 'Get user sessions successfully',
      data: sessions.map(SessionResponseDto.toResponse),
    };
  }

  /** Revoke a single session */
  @Patch(':id/revoke')
  async revoke(@Param('id') id: string) {
    await this.revokeSessionUseCase.execute(id);
    return { message: 'Session revoked successfully' };
  }

  /** Revoke all sessions for a user */
  @Patch('/users/:userId/revoke-all')
  async revokeAll(@Param('userId') userId: string) {
    await this.revokeAllSessionsUseCase.execute(userId);
    return { message: 'All user sessions revoked successfully' };
  }
}
