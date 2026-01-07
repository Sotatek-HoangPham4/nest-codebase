import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
      throw new UnauthorizedException('Invalid Bearer token');
    }

    try {
      const payload = this.jwtService.verify(token);

      req.user = {
        id: payload.sub,
        username: payload.username,
        roles: payload.roles ?? [],
        permissions: payload.permissions ?? [],
      };

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
