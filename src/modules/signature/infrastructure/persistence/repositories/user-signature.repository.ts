import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSignatureRepositoryInterface } from '../../../domain/repositories/user-signature.repository.interface';
import { UserSignatureEntity } from '../../../domain/entities/user-signature.entity';
import { UserSignatureOrmEntity } from '../orm/user-signature.orm-entity';
import { UserSignatureMapper } from '../mappers/user-signature.mapper';

@Injectable()
export class UserSignatureRepository implements UserSignatureRepositoryInterface {
  constructor(
    @InjectRepository(UserSignatureOrmEntity)
    private readonly repo: Repository<UserSignatureOrmEntity>,
  ) {}

  async findActiveByUserId(
    userId: string,
  ): Promise<UserSignatureEntity | null> {
    const found = await this.repo.findOne({
      where: { userId, status: 'ACTIVE' },
    });
    return found ? UserSignatureMapper.toDomain(found) : null;
  }

  async findById(id: string): Promise<UserSignatureEntity | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? UserSignatureMapper.toDomain(found) : null;
  }

  async create(entity: UserSignatureEntity): Promise<UserSignatureEntity> {
    const orm = UserSignatureMapper.toOrm(entity);
    await this.repo.insert(orm);
    const saved = await this.repo.findOneByOrFail({ id: orm.id });
    return UserSignatureMapper.toDomain(saved);
  }

  async save(entity: UserSignatureEntity): Promise<UserSignatureEntity> {
    const orm = UserSignatureMapper.toOrm(entity);
    await this.repo.save(orm);
    const saved = await this.repo.findOneByOrFail({ id: orm.id });
    return UserSignatureMapper.toDomain(saved);
  }
}
