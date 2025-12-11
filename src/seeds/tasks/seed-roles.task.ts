import { Inject, Injectable } from '@nestjs/common';

import { RoleEntity } from '@/modules/role/domain/entities/role.entity';
import {
  IRoleRepositoryToken,
  type IRoleRepository,
} from '@/modules/role/domain/repositories/role.repository.interface';

import { v4 as uuid } from 'uuid';
import { BaseSeedTask } from './base-seed.task';

@Injectable()
export class SeedRolesTask extends BaseSeedTask {
  constructor(
    @Inject(IRoleRepositoryToken) private readonly roleRepo: IRoleRepository,
  ) {
    super();
  }

  async run() {
    const defaultRoles = [
      { name: 'admin', description: 'Administrator' },
      { name: 'user', description: 'Normal user' },
      { name: 'guest', description: 'Guest account' },
      { name: 'mentor', description: 'Mentor / Instructor' },
      { name: 'trader', description: 'Trader role' },
    ];

    for (const r of defaultRoles) {
      const exists = await this.roleRepo.findByName(r.name);

      if (!exists) {
        // Create DDD-compliant RoleEntity
        const role = RoleEntity.create({
          id: uuid(),
          name: r.name,
          description: r.description,
        });

        await this.roleRepo.save(role);

        console.log(`✅ Seeded role: ${r.name}`);
      } else {
        console.log(`⏩ Role existed: ${r.name}`);
      }
    }
  }
}
