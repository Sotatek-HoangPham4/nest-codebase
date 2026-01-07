import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignatureRepositoryInterface } from '../../../domain/repositories/signature.repository.interface';
import { SignatureEntity } from '../../../domain/entities/signature.entity';
import { SignatureOrmEntity } from '../orm/signature.orm-entity';
import { SignatureMapper } from '../mappers/signature.mapper';

@Injectable()
export class SignatureRepository implements SignatureRepositoryInterface {
  constructor(
    @InjectRepository(SignatureOrmEntity)
    private readonly repo: Repository<SignatureOrmEntity>,
  ) {}

  async create(entity: SignatureEntity): Promise<SignatureEntity> {
    const orm = SignatureMapper.toOrm(entity);
    await this.repo.insert(orm);
    const saved = await this.repo.findOneByOrFail({ id: orm.id });
    return SignatureMapper.toDomain(saved);
  }

  async save(entity: SignatureEntity): Promise<SignatureEntity> {
    const orm = SignatureMapper.toOrm(entity);
    await this.repo.save(orm);
    const saved = await this.repo.findOneByOrFail({ id: orm.id });
    return SignatureMapper.toDomain(saved);
  }

  async findById(id: string): Promise<SignatureEntity | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? SignatureMapper.toDomain(found) : null;
  }

  async findByDocumentId(documentId: string): Promise<SignatureEntity[]> {
    const rows = await this.repo.find({
      where: { documentId },
      order: { index: 'ASC' },
    });
    return rows.map(SignatureMapper.toDomain);
  }

  async findSignedByDocumentId(documentId: string): Promise<SignatureEntity[]> {
    const rows = await this.repo.find({
      where: { documentId, status: 'SIGNED' },
      order: { index: 'ASC' },
    });
    return rows.map(SignatureMapper.toDomain);
  }

  async findByDocumentIdAndIndex(documentId: string, index: number) {
    const found = await this.repo.findOne({ where: { documentId, index } });
    return found ? SignatureMapper.toDomain(found) : null;
  }

  async findPendingByDocumentId(documentId: string) {
    const rows = await this.repo.find({
      where: { documentId, status: 'PENDING' },
    });
    return rows.map(SignatureMapper.toDomain);
  }

  async isPreviousIndexSigned(documentId: string, index: number) {
    if (index <= 0) return true;
    const prev = await this.repo.findOne({
      where: { documentId, index: index - 1 },
    });
    return !!prev && prev.status === 'SIGNED';
  }

  async findByDocumentSignerIndex(
    documentId: string,
    signerId: string,
    index: number,
  ): Promise<SignatureEntity | null> {
    const row = await this.repo.findOne({
      where: { documentId, signerId, index },
    });
    return row ? SignatureMapper.toDomain(row) : null;
  }

  // async findByDocumentId(documentId: string) {
  //   const rows = await this.ormRepo.find({
  //     where: { documentId },
  //     order: { index: 'ASC' },
  //   });
  //   return rows.map((r) => this.toDomain(r));
  // }
}
