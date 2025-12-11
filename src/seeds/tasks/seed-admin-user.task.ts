// import { Injectable } from '@nestjs/common';
// import { BaseSeedTask } from './base-seed.task';
// import type { IUserRepository } from '@/modules/user/domain/repositories/user.repository.interface';
// import type { IRoleRepository } from '@/modules/role/domain/repositories/role.repository.interface';

// @Injectable()
// export class SeedAdminUserTask extends BaseSeedTask {
//   constructor(
//     private readonly userRepo: IUserRepository,
//     private readonly roleRepo: IRoleRepository,
//     // private readonly bcrypt: IBcryptService,
//   ) {
//     super();
//   }

//   async run() {
//     const exists = await this.userRepo.findByEmail('admin@system.com');
//     if (exists) {
//       console.log('⏩ Admin user existed');
//       return;
//     }

//     const adminRole = await this.roleRepo.findByName('admin');
//     const hashed = await this.bcrypt.hash('Admin@123');

//     await this.userRepo.create({
//       email: 'admin@system.com',
//       username: 'admin',
//       password: hashed,
//       roleId: adminRole.id,
//     });

//     console.log('👑 Created default admin user');
//   }
// }
