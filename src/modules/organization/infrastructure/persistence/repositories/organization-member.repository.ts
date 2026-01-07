import { OrganizationMemberRepository } from '@/modules/organization/domain/repositories/organization-member.repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationMemberOrm } from '../orm/organization-member.orm-entity';
import { Repository } from 'typeorm';
import { OrganizationMember } from '@/modules/organization/domain/entities/organization-member.entity';
import { OrganizationMemberMapper } from '../mappers/organization-member.mapper';

@Injectable()
export class OrganizationMemberRepositoryImpl implements OrganizationMemberRepository {
  constructor(
    @InjectRepository(OrganizationMemberOrm)
    private readonly repo: Repository<OrganizationMemberOrm>,
  ) {}

  async findMembers(orgId: string): Promise<OrganizationMember[]> {
    const rows = await this.repo.find({
      where: { organizationId: orgId },
    });

    return rows.map(OrganizationMemberMapper.toDomain);
  }

  async findOrganizationsByUser(userId: string) {
    const orms = await this.repo.find({ where: { userId } });

    return orms.map((orm) => OrganizationMemberMapper.toDomain(orm));
  }

  async exists(orgId: string, userId: string): Promise<boolean> {
    const count = await this.repo.count({
      where: { organizationId: orgId, userId: userId },
    });
    return count > 0;
  }

  async addMember(input) {
    await this.repo.save(input);
  }

  async removeMember(orgId: string, userId: string) {
    await this.repo.delete({ organizationId: orgId, userId });
  }

  async changeRole(orgId: string, userId: string, roleId: string) {
    const member = await this.repo.findOne({
      where: { organizationId: orgId, userId },
    });

    if (!member) return;

    member.roleId = roleId;
    await this.repo.save(member);
  }
}
