import { Inject, Injectable } from '@nestjs/common';
import { OrganizationCodeGenerator } from '../../domain/services/organization-code-generator.interface';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';

@Injectable()
export class OrganizationCodeGeneratorService implements OrganizationCodeGenerator {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly organizationRepo: OrganizationRepository,
  ) {}
  async generate(name: string): Promise<string> {
    const baseCode = this.normalize(name);

    let code = baseCode;
    let counter = 1;

    while (await this.organizationRepo.findByCode(code)) {
      code = `${baseCode}_${String(counter).padStart(2, '0')}`;
      counter++;
    }

    return code;
  }

  private normalize(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .toUpperCase()
      .slice(0, 20);
  }
}
