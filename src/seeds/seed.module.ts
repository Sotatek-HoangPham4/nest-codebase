import { forwardRef, Module } from '@nestjs/common';
import { AppModule } from '@/app.module';

import { SeedService } from './seed.service';
import { SeedRunner } from './seed.runner';

import { SeedRolesTask } from './tasks/seed-roles.task';
import { RoleModule } from '@/modules/role/role.module';
import { DatabaseModule } from '@/infrastructure/database/database.module';
// import { SeedPermissionsTask } from './tasks/seed-permissions.task';
// import { SeedRolePermissionsTask } from './tasks/seed-role-permissions.task';
// import { SeedAdminUserTask } from './tasks/seed-admin-user.task';

@Module({
  imports: [RoleModule, DatabaseModule],

  providers: [
    SeedService,
    SeedRunner,
    SeedRolesTask,
    // SeedPermissionsTask,
    // SeedRolePermissionsTask,
    // SeedAdminUserTask,
  ],

  exports: [SeedRunner],
})
export class SeedModule {}
