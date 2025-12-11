// Mapper between ORM entity and Domain entity.
import { PermissionOrmEntity } from '../orm/permission.orm-entity';
import { Permission } from '../../../domain/entities/permission.entity';
import { PermissionCode } from '../../../domain/value-objects/permission-code.vo';

export class PermissionMapper {
  static toDomain(raw: PermissionOrmEntity): Permission {
    return new Permission({
      id: raw.id,
      code: PermissionCode.create(raw.code),
      description: raw.description ?? undefined,
      group: raw.group ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toOrm(permission: Permission): PermissionOrmEntity {
    const orm = new PermissionOrmEntity();
    orm.id = permission.id;
    orm.code = permission.code.toString();
    orm.description = permission.description;
    orm.group = permission.group;
    orm.createdAt = permission.createdAt;
    orm.updatedAt = permission.updatedAt;
    return orm;
  }
}
