import { Repository } from 'typeorm';
import { OrganizationRepository } from '../../../domain/repositories/organization.repository.interface';
import { Organization } from '../../../domain/entities/organization.entity';
import { OrganizationOrmEntity } from '../orm/organization.orm-entity';
import { OrganizationMapper } from '../mappers/organization.mapper';
import { InjectRepository } from '@nestjs/typeorm';

export class OrganizationRepositoryImpl implements OrganizationRepository {
  constructor(
    @InjectRepository(OrganizationOrmEntity)
    private readonly repo: Repository<OrganizationOrmEntity>,
  ) {}

  async create(org: Organization): Promise<Organization> {
    const orm = await this.repo.save(OrganizationMapper.toOrm(org));
    return OrganizationMapper.toDomain(orm);
  }

  async findById(id: string) {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? OrganizationMapper.toDomain(orm) : null;
  }

  async findByName(name: string): Promise<Organization | null> {
    const orm = await this.repo.findOne({
      where: { name: name.trim() },
    });
    return orm ? OrganizationMapper.toDomain(orm) : null;
  }

  async findByCode(code: string) {
    const orm = await this.repo.findOne({ where: { code } });
    return orm ? OrganizationMapper.toDomain(orm) : null;
  }

  async update(org: Organization): Promise<Organization> {
    if (!org.id) {
      throw new Error('Cannot update organization without id');
    }

    const orm = await this.repo.save(OrganizationMapper.toOrm(org));

    return OrganizationMapper.toDomain(orm);
  }

  async delete(id: string) {
    await this.repo.delete(id);
  }
}
