import { OrgRole } from '../../domain/value-objects/org-role.vo';

export class AddMemberDto {
  userId: string;
  roleId?: string;
}
