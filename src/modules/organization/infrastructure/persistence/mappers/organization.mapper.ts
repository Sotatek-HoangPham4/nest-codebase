import { Organization } from '../../../domain/entities/organization.entity';
import { OrganizationOrmEntity } from '../orm/organization.orm-entity';

export class OrganizationMapper {
  static toDomain(orm: OrganizationOrmEntity): Organization {
    return new Organization({
      id: orm.id,
      code: orm.code,
      name: orm.name,
      description: orm.description,
      ownerId: orm.owner_id, // ✅ map snake_case → camelCase
      is_active: orm.is_active,
      settings: orm.settings,
      created_at: orm.created_at,
      updated_at: orm.updated_at,
    });
  }

  static toOrm(org: Organization): OrganizationOrmEntity {
    const props = org.getProps();

    const orm = new OrganizationOrmEntity();
    orm.id = props.id!;
    orm.code = props.code;
    orm.name = props.name;
    orm.description = props.description!;
    orm.owner_id = props.ownerId; // ✅ camelCase → snake_case
    orm.is_active = props.is_active;
    orm.settings = props.settings;
    orm.created_at = props.created_at;
    orm.updated_at = props.updated_at;

    return orm;
  }
}
