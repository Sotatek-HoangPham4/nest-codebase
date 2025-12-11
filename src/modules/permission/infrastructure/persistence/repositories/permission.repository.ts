// Concrete implementation of PermissionRepository using TypeORM.
// This class will be provided under the DI token 'PermissionRepository'.
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PermissionOrmEntity } from '../orm/permission.orm-entity';
import { IPermissionRepository } from '../../../domain/repositories/permission.repository.interface';
import { Permission } from '../../../domain/entities/permission.entity';
import { PermissionMapper } from '../mappers/permission.mapper';

@Injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    private readonly repo: Repository<PermissionOrmEntity>,
  ) {}

  async findById(id: string): Promise<Permission | null> {
    const raw = await this.repo.findOne({ where: { id } });
    return raw ? PermissionMapper.toDomain(raw) : null;
  }

  async findByCode(code: string): Promise<Permission | null> {
    const raw = await this.repo.findOne({ where: { code } });
    return raw ? PermissionMapper.toDomain(raw) : null;
  }

  async findAll(
    filter?: { group?: string; q?: string },
    pagination?: { skip: number; take: number },
  ) {
    const qb = this.repo.createQueryBuilder('p');

    if (filter?.group) {
      qb.andWhere('p.group = :group', { group: filter.group });
    }
    if (filter?.q) {
      qb.andWhere('(p.code ILIKE :q OR p.description ILIKE :q)', {
        q: `%${filter.q}%`,
      });
    }

    qb.skip(pagination?.skip ?? 0)
      .take(pagination?.take ?? 50)
      .orderBy('p.code', 'ASC');

    const [items, total] = await qb.getManyAndCount();
    return { items: items.map(PermissionMapper.toDomain), total };
  }

  async create(permission: Permission): Promise<Permission> {
    const orm = PermissionMapper.toOrm(permission);
    const saved = await this.repo.save(orm);
    return PermissionMapper.toDomain(saved);
  }

  async createMany(permissions: Permission[]): Promise<Permission[]> {
    const orms = permissions.map(PermissionMapper.toOrm);
    const saved = await this.repo.save(orms);
    return saved.map(PermissionMapper.toDomain);
  }

  async deleteById(id: string): Promise<void> {
    await this.repo.delete({ id });
  }

  async update(permission: Permission): Promise<Permission> {
    const orm = PermissionMapper.toOrm(permission);
    const saved = await this.repo.save(orm);
    return PermissionMapper.toDomain(saved);
  }
}
