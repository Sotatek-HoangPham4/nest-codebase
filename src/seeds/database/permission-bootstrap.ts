// import { Injectable, INestApplicationContext } from '@nestjs/common';
// import type { PermissionRepository } from '@/modules/permission/domain/repositories/permission.repository.interface';
// import { PERMISSIONS } from '@/modules/permission/seeds/permissions.seed';
// import { Permission } from '@/modules/permission/domain/entities/permission.entity';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable()
// export class PermissionBootstrap {
//   constructor(private readonly repo: PermissionRepository) {}

//   async run() {
//     const toCreate: Permission[] = [];

//     for (const p of PERMISSIONS) {
//       const exists = await this.repo.findByCode(p.code);

//       if (!exists) {
//         toCreate.push(
//           new Permission({
//             id: uuidv4(),
//             code: p.code,
//             description: p.description,
//             group: p.group,
//           }),
//         );
//       }
//     }

//     if (toCreate.length > 0) {
//       await this.repo.createMany(toCreate);
//       console.log(`Seeded ${toCreate.length} permissions.`);
//     } else {
//       console.log('Permissions already seeded.');
//     }
//   }
// }

// export default PermissionBootstrap;
