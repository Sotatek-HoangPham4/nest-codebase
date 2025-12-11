import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Custom decorator to attach required roles to controller routes.
 * The RoleGuard will later verify if the authenticated user has any of these roles.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
