// import { Injectable } from '@nestjs/common';
// import { BaseSeedTask } from './base-seed.task';
// import type { IRoleRepository } from '@/modules/role/domain/repositories/role.repository.interface';

// @Injectable()
// export class SeedRolePermissionsTask extends BaseSeedTask {
//   constructor(private readonly roleRepo: IRoleRepository) {
//     super();
//   }

//   async run() {
//     const admin = await this.roleRepo.findByName('admin');
//     if (!admin) return;

//     const allPermissions = await this.roleRepo.getAllPermissions();

//     await this.roleRepo.assignPermission(
//       admin.id,
//       allPermissions.map((p) => p.id),
//     );

//     console.log('🔗 Gán toàn bộ permission cho role admin');
//   }
// }
