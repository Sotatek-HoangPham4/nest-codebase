import { OrganizationMember } from '../entities/organization-member.entity';
import { OrgRole } from '../value-objects/org-role.vo';

export const ORGANIZATION_MEMBER_REPOSITORY = 'OrganizationMemberRepository';

export interface OrganizationMemberRepository {
  findMembers(orgId: string): Promise<OrganizationMember[]>;

  findOrganizationsByUser(userId: string): Promise<any[]>;

  exists(orgId: string, userId: string): Promise<boolean>;

  addMember(input: {
    organizationId: string;
    userId: string;
    roleId: string;
  }): Promise<void>;

  removeMember(orgId: string, userId: string): Promise<void>;

  changeRole(orgId: string, userId: string, roleId: string): Promise<void>;
}
