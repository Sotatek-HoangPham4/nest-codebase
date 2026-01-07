export const ORGANIZATION_CODE_GENERATOR = 'OrganizationCodeGenerator';

export interface OrganizationCodeGenerator {
  generate(baseName: string): Promise<string>;
}
