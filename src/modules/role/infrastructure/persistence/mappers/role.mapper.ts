import { RoleOrm } from '../orm/role.orm-entity';
import { RoleEntity } from '../../../domain/entities/role.entity';

export const RoleMapper = {
  toDomain(orm: RoleOrm): RoleEntity {
    return RoleEntity.restore({
      id: orm.id,
      name: orm.name,
      description: orm.description ?? null,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt ?? null,
    });
  },
  toOrm(entity: RoleEntity): Partial<RoleOrm> {
    const p = entity.toPrimitives();
    return {
      id: p.id,
      name: p.name,
      description: p.description ?? null,
      createdAt: new Date(p.createdAt),
      updatedAt: p.updatedAt ? new Date(p.updatedAt) : null,
    };
  },
};
