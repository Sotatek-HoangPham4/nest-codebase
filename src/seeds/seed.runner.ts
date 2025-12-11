import { Injectable } from '@nestjs/common';
import { SeedRolesTask } from './tasks/seed-roles.task';
// import { SeedPermissionsTask } from './tasks/seed-permissions.task';

// import { SeedRolePermissionsTask } from './tasks/seed-role-permissions.task';
// import { SeedAdminUserTask } from './tasks/seed-admin-user.task';

@Injectable()
export class SeedRunner {
  constructor(
    private readonly seedRoles: SeedRolesTask,
    // private readonly seedPermissions: SeedPermissionsTask,
    // private readonly seedRolePermissions: SeedRolePermissionsTask,
    // private readonly seedAdminUser: SeedAdminUserTask,
  ) {}

  async runAll() {
    console.log('🚀 Start run seed...');

    await this.seedRoles.run();
    // await this.seedPermissions.run();
    // await this.seedRolePermissions.run();
    // await this.seedAdminUser.run();
  }
}
