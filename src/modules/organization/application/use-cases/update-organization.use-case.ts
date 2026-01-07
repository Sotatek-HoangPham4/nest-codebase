import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';
import { UpdateOrganizationDto } from '../dtos/update-organization.dto';

@Injectable()
export class UpdateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,
  ) {}

  async execute(id: string, dto: UpdateOrganizationDto) {
    const org = await this.repo.findById(id);
    if (!org) throw new NotFoundException();

    org.update(dto);
    await this.repo.update(org);

    return org;
  }
}
