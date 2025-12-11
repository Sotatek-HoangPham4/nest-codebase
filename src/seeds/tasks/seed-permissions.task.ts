// import { Injectable } from '@nestjs/common';
// import { BaseSeedTask } from './base-seed.task';
// import type { PermissionRepository } from '@/modules/permission/domain/repositories/permission.repository.interface';

// @Injectable()
// export class SeedPermissionsTask extends BaseSeedTask {
//   constructor(private readonly permissionRepo: PermissionRepository) {
//     super();
//   }

//   async run() {
//     const list = [
//       { name: 'user.read', description: 'Read users' },
//       { name: 'user.write', description: 'Write users' },
//       { name: 'role.read', description: 'Read roles' },
//       { name: 'role.write', description: 'Write roles' },
//     ];

//     for (const p of list) {
//       const exists = await this.permissionRepo.findByCode(p.name);
//       if (!exists) {
//         await this.permissionRepo.create(p);
//         console.log(`✅ Seed permission: ${p.name}`);
//       } else {
//         console.log(`⏩ Permission existed: ${p.name}`);
//       }
//     }
//   }
// }
