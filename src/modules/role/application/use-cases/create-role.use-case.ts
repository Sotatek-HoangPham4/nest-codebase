import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { RoleEntity } from '../../domain/entities/role.entity';
import type { IRoleRepository } from '../../domain/repositories/role.repository.interface';
import { IRoleRepositoryToken } from '../../domain/repositories/role.repository.interface';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class CreateRoleUseCase {
  constructor(
    @Inject(IRoleRepositoryToken) private readonly repo: IRoleRepository,
  ) {}

  async execute(dto: CreateRoleDto) {
    const existing = await this.repo.findByName(dto.name);
    if (existing) throw new Error('Role with same name exists');

    const role = RoleEntity.create({
      id: randomUUID(),
      name: dto.name,
      description: dto.description ?? null,
    });
    await this.repo.save(role);
    return role.toPrimitives();
  }
}
