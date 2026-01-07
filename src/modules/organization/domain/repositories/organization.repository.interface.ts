import { Organization } from '../entities/organization.entity';

export const ORGANIZATION_REPOSITORY = 'OrganizationRepository';

export interface OrganizationRepository {
  create(org: Organization): Promise<Organization>;
  findById(id: string): Promise<Organization | null>;
  findByCode(code: string): Promise<Organization | null>;
  findByName(name: string): Promise<Organization | null>;
  update(org: Organization): Promise<Organization>;
  delete(id: string): Promise<void>;
}
