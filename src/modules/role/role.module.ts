import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleOrm } from './infrastructure/persistence/orm/role.orm-entity';
import { RolePermissionOrm } from './infrastructure/persistence/orm/role-permission.orm-entity';
import { UserRoleOrm } from './infrastructure/persistence/orm/user-role.orm-entity';
import { RoleRepository } from './infrastructure/persistence/repositories/role.repository';
import { IRoleRepositoryToken } from './domain/repositories/role.repository.interface';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';
import { AssignRoleUseCase } from './application/use-cases/assign-role.use-case';
import { AssignPermissionUseCase } from './application/use-cases/assign-permission.use-case';
import { GetUserRolesUseCase } from './application/use-cases/get-user-roles.use-case';
import { GetUserPermissionsUseCase } from './application/use-cases/get-user-permissions.use-case';
import { RoleController } from './interfaces/controllers/role.controller';
import {
  type IPermissionRepository,
  IPermissionRepositoryToken,
} from '../permission/domain/repositories/permission.repository.interface';
import { PermissionRepository } from '../permission/infrastructure/persistence/repositories/permission.repository';
import { PermissionOrmEntity } from '../permission/infrastructure/persistence/orm/permission.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleOrm,
      RolePermissionOrm,
      UserRoleOrm,
      PermissionOrmEntity,
    ]),
  ],
  controllers: [RoleController],
  providers: [
    { provide: IRoleRepositoryToken, useClass: RoleRepository },
    { provide: IPermissionRepositoryToken, useClass: PermissionRepository },
    CreateRoleUseCase,
    AssignRoleUseCase,
    AssignPermissionUseCase,
    GetUserRolesUseCase,
    GetUserPermissionsUseCase,
  ],
  exports: [IRoleRepositoryToken],
})
export class RoleModule {}
