import type { Response } from 'express';

interface SetAuthCookiesOptions {
  res: Response;
  sessionId: string;
  refreshToken: string;
  refreshTokenTTLMs?: number;
  path?: string;
}

interface ClearAuthCookiesOptions {
  res: Response;
  path?: string;
}

export function setAuthCookies({
  res,
  sessionId,
  refreshToken,
  refreshTokenTTLMs = 7 * 24 * 60 * 60 * 1000,
  path = '/',
}: SetAuthCookiesOptions) {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path,
    maxAge: refreshTokenTTLMs,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path,
    maxAge: refreshTokenTTLMs,
  });
}

export function clearAuthCookies({ res, path = '/' }: ClearAuthCookiesOptions) {
  const isProd = process.env.NODE_ENV === 'production';

  res.clearCookie('sessionId', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path,
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    path,
  });
}
