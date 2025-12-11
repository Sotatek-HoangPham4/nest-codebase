import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Put,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { CreateRoleUseCase } from '../../application/use-cases/create-role.use-case';
import { AssignRoleUseCase } from '../../application/use-cases/assign-role.use-case';
import { AssignPermissionUseCase } from '../../application/use-cases/assign-permission.use-case';
import { GetUserRolesUseCase } from '../../application/use-cases/get-user-roles.use-case';
import { GetUserPermissionsUseCase } from '../../application/use-cases/get-user-permissions.use-case';
import { CreateRoleDto } from '../../application/dtos/create-role.dto';
import { RoleResponseDto } from '../dtos/role.response.dto';
import { AssignRoleDto } from '../../application/dtos/assign-role.dto';
import { AssignPermissionDto } from '../../application/dtos/assign-permission.dto';
import { PermissionGuard } from '@/modules/auth/guards/permission.guard';

import { Permissions } from '@/modules/auth/decorators/permissions.decorator';
import { RoleGuard } from '@/modules/auth/guards/role.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly createRoleUC: CreateRoleUseCase,
    private readonly assignRoleUC: AssignRoleUseCase,
    private readonly assignPermUC: AssignPermissionUseCase,
    private readonly getUserRolesUC: GetUserRolesUseCase,
    private readonly getUserPermsUC: GetUserPermissionsUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateRoleDto) {
    const res = await this.createRoleUC.execute(dto);
    return {
      message: 'Create new role successfully.',
      data: RoleResponseDto.fromPrimitives(res),
    };
  }

  @Post('assign')
  async assignRole(@Body() dto: AssignRoleDto) {
    await this.assignRoleUC.execute(dto);
    return { message: 'Role assigned to user successfully.' };
  }

  @Post('assign-permission')
  async assignPermission(@Body() dto: AssignPermissionDto) {
    const res = await this.assignPermUC.execute(dto);
    return {
      message: 'Permission assigned to role successfully.',
      data: res,
    };
  }

  @Get('user/:userId')
  @Roles('admin') // Require 'admin' role
  @UseGuards(RoleGuard)
  async getUserRoles(@Param('userId') userId: string) {
    const roles = await this.getUserRolesUC.execute(userId);
    return {
      message: 'Get user roles successfully.',
      data: { roles },
    };
  }

  @Get('user/:userId/permissions')
  // @Permissions('user:create', 'user:delete') // Require either permission to access
  // @UseGuards(PermissionGuard)
  async getUserPermissions(@Param('userId') userId: string) {
    const permissions = await this.getUserPermsUC.execute(userId);
    return {
      message: 'Get user permissions successfully.',
      data: { permissions },
    };
  }
}
