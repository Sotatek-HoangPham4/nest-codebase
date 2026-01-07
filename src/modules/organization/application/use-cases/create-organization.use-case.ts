import {
  ORGANIZATION_REPOSITORY,
  type OrganizationRepository,
} from '../../domain/repositories/organization.repository.interface';
import { Organization } from '../../domain/entities/organization.entity';
import { CreateOrganizationDto } from '../dtos/create-organization.dto';
import { ConflictException, Inject } from '@nestjs/common';
import {
  ORGANIZATION_CODE_GENERATOR,
  type OrganizationCodeGenerator,
} from '../../domain/services/organization-code-generator.interface';
import {
  ORGANIZATION_MEMBER_REPOSITORY,
  type OrganizationMemberRepository,
} from '../../domain/repositories/organization-member.repository.interface';
import { OrgRole } from '../../domain/value-objects/org-role.vo';
import {
  type IRoleRepository,
  IRoleRepositoryToken,
} from '@/modules/role/domain/repositories/role.repository.interface';

export class CreateOrganizationUseCase {
  constructor(
    @Inject(ORGANIZATION_REPOSITORY)
    private readonly repo: OrganizationRepository,

    @Inject(ORGANIZATION_MEMBER_REPOSITORY)
    private readonly memberRepo: OrganizationMemberRepository,

    @Inject(ORGANIZATION_CODE_GENERATOR)
    private readonly codeGenerator: OrganizationCodeGenerator,

    @Inject(IRoleRepositoryToken)
    private readonly roleRepo: IRoleRepository,
  ) {}

  async execute(dto: CreateOrganizationDto, ownerId: string) {
    // 1) check name (normalize)
    const normalizedName = dto.name.trim();
    const existedByName = await this.repo.findByName(normalizedName);
    if (existedByName) {
      throw new ConflictException('Organization name already exists');
    }

    // 2) generate code (và nên đảm bảo unique)
    // Nếu codeGenerator đã handle unique thì OK.
    // Nếu chưa, bạn nên loop check findByCode và regenerate (mình add bản safe ở dưới).
    const code = await this.codeGenerator.generate(normalizedName);

    // (optional safety) check code collision
    const existedByCode = await this.repo.findByCode(code);
    if (existedByCode) {
      throw new ConflictException('Organization code already exists');
    }

    // 3) create org
    const org = Organization.create({
      name: normalizedName,
      code,
      description: dto.description,
      ownerId,
    });

    const createdOrg = await this.repo.create(org);

    // 4) add owner with admin role
    const adminRole = await this.roleRepo.findByName('admin');
    if (!adminRole) throw new Error('Admin role not found');

    await this.memberRepo.addMember({
      organizationId: createdOrg.id!,
      userId: ownerId,
      roleId: adminRole.id,
    });

    return createdOrg;
  }
}
