import { OrgRole } from '@/modules/organization/domain/value-objects/org-role.vo';
import { OrganizationMember } from '../../../domain/entities/organization-member.entity';
import { OrganizationMemberOrm } from '../orm/organization-member.orm-entity';

export class OrganizationMemberMapper {
  static toDomain(orm: OrganizationMemberOrm): OrganizationMember {
    return new OrganizationMember({
      id: orm.id,
      organizationId: orm.organizationId,
      userId: orm.userId,
      roleId: orm.roleId,
      joinedAt: orm.joinedAt,
    });
  }
}
