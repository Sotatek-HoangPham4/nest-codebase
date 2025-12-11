// Wire up the module: controllers, use-cases, repository implementation.
// Bind repository implementation to the DI token 'PermissionRepository'.

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionOrmEntity } from './infrastructure/persistence/orm/permission.orm-entity';
import { PermissionRepository } from './infrastructure/persistence/repositories/permission.repository';
import { CreatePermissionUseCase } from './application/use-cases/create-permission.use-case';

import { PermissionController } from './presentation/controllers/permission.controller';
import { GetPermissionDetailsUseCase } from './application/use-cases/get-permission-details.use-case';
import { GetPermissionsUseCase } from './application/use-cases/get-permission.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionOrmEntity])],
  controllers: [PermissionController],
  providers: [
    CreatePermissionUseCase,
    GetPermissionsUseCase,
    GetPermissionDetailsUseCase,
    // Bind the token 'PermissionRepository' to concrete impl
    {
      provide: 'PermissionRepository',
      useClass: PermissionRepository,
    },
  ],
  exports: ['PermissionRepository'], // available to other modules (role assignment)
})
export class PermissionModule {}
