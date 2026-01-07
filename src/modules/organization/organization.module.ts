import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

/**
 * Presentation
 */
import { OrganizationController } from './presentation/controllers/organization.controller';

/**
 * Application - Use cases
 */
import { CreateOrganizationUseCase } from './application/use-cases/create-organization.use-case';
import { GetOrganizationUseCase } from './application/use-cases/get-organization.use-case';
import { UpdateOrganizationUseCase } from './application/use-cases/update-organization.use-case';
import { DeleteOrganizationUseCase } from './application/use-cases/delete-organization.use-case';

/**
 * Infrastructure
 */
import { OrganizationOrmEntity } from './infrastructure/persistence/orm/organization.orm-entity';
import { OrganizationRepositoryImpl } from './infrastructure/persistence/repositories/organization.repository';

/**
 * Domain
 */
import {
  ORGANIZATION_REPOSITORY,
  OrganizationRepository,
} from './domain/repositories/organization.repository.interface';
import { OrganizationCodeGeneratorService } from './infrastructure/services/organization-code-generator.service';
import { ORGANIZATION_CODE_GENERATOR } from './domain/services/organization-code-generator.interface';
import { OrganizationMemberRepositoryImpl } from './infrastructure/persistence/repositories/organization-member.repository';
import { ORGANIZATION_MEMBER_REPOSITORY } from './domain/repositories/organization-member.repository.interface';
import { OrganizationMemberOrm } from './infrastructure/persistence/orm/organization-member.orm-entity';
import { GetMyOrganizationsUseCase } from './application/use-cases/get-my-organizations.use-case';
import { GetCurrentOrganizationUseCase } from './application/use-cases/get-current-organization.use-case';
import { GetOrganizationMembersUseCase } from './application/use-cases/get-organization-members.use-case';
import { AddOrganizationMemberUseCase } from './application/use-cases/add-organization-member.use-case';
import { RemoveOrganizationMemberUseCase } from './application/use-cases/remove-organization-member.use-case';
import { ChangeMemberRoleUseCase } from './application/use-cases/change-member-role.use-case';
import { GetOrganizationSettingsUseCase } from './application/use-cases/get-organization-settings.use-case';
import { UpdateOrganizationSettingsUseCase } from './application/use-cases/update-organization-settings.use-case';
import { IRoleRepositoryToken } from '../role/domain/repositories/role.repository.interface';
import { RoleRepository } from '../role/infrastructure/persistence/repositories/role.repository';
import { RoleOrm } from '../role/infrastructure/persistence/orm/role.orm-entity';
import { RolePermissionOrm } from '../role/infrastructure/persistence/orm/role-permission.orm-entity';
import { UserRoleOrm } from '../role/infrastructure/persistence/orm/user-role.orm-entity';
import { PermissionOrmEntity } from '../permission/infrastructure/persistence/orm/permission.orm-entity';
import { UserRepository } from '../user/infrastructure/repositories/user.repository';
import { UserOrmEntity } from '../user/infrastructure/orm/user.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrganizationOrmEntity, // 🔗 bind TypeORM entity
      OrganizationMemberOrm,
      RoleOrm,
      RolePermissionOrm,
      UserRoleOrm,
      PermissionOrmEntity,
      UserOrmEntity,
    ]),
  ],

  controllers: [OrganizationController],

  providers: [
    /**
     * Use Cases
     */
    CreateOrganizationUseCase,
    GetOrganizationUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
    GetMyOrganizationsUseCase,
    GetCurrentOrganizationUseCase,
    GetOrganizationMembersUseCase,
    AddOrganizationMemberUseCase,
    RemoveOrganizationMemberUseCase,
    ChangeMemberRoleUseCase,
    GetOrganizationSettingsUseCase,
    UpdateOrganizationSettingsUseCase,

    /**
     * Repository binding (Interface → Implementation)
     */
    {
      provide: ORGANIZATION_REPOSITORY,
      useClass: OrganizationRepositoryImpl,
    },
    {
      provide: ORGANIZATION_CODE_GENERATOR,
      useClass: OrganizationCodeGeneratorService,
    },
    {
      provide: ORGANIZATION_MEMBER_REPOSITORY,
      useClass: OrganizationMemberRepositoryImpl,
    },

    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },

    {
      provide: IRoleRepositoryToken,
      useClass: RoleRepository,
    },
  ],

  exports: [
    /**
     * Export repository + use cases
     * để module khác (Document, RBAC, Workflow...) dùng
     */
    ORGANIZATION_REPOSITORY,
    ORGANIZATION_CODE_GENERATOR,
    ORGANIZATION_MEMBER_REPOSITORY,
    CreateOrganizationUseCase,
    GetOrganizationUseCase,
    UpdateOrganizationUseCase,
    DeleteOrganizationUseCase,
  ],
})
export class OrganizationModule {}
