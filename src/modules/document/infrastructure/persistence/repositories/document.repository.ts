import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DocumentRepository } from '../../../domain/repositories/document.repository.interface';
import { DocumentOrm } from '../orm/document.orm-entity';
import { toDomain, toOrm } from '../mappers/document.mapper';
import { Document } from '../../../domain/entities/document.entity';
import { DocumentStatus } from '@/modules/document/domain/value-objects/document-status.enum';

@Injectable()
export class TypeOrmDocumentRepository implements DocumentRepository {
  constructor(
    @InjectRepository(DocumentOrm)
    private readonly repo: Repository<DocumentOrm>,
  ) {}

  async create(doc: Document): Promise<Document> {
    const ormObj = this.repo.create(toOrm(doc) as DocumentOrm);
    const saved = await this.repo.save(ormObj);
    return toDomain(saved);
  }

  async save(doc: Document): Promise<Document> {
    await this.repo.update({ id: doc.id }, toOrm(doc));
    const updated = await this.repo.findOne({ where: { id: doc.id } });
    return updated ? toDomain(updated) : doc;
  }

  async findById(id: string): Promise<Document | null> {
    const found = await this.repo.findOne({ where: { id } });
    return found ? toDomain(found) : null;
  }

  async findByOwner(
    ownerId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Document[]> {
    const found = await this.repo.find({
      where: { ownerId },
      take: options?.limit,
      skip: options?.offset,
      order: { updatedAt: 'DESC' },
    });
    return found.map(toDomain);
  }

  async findByOwnerAndTitle(
    ownerId: string,
    title: string,
  ): Promise<Document | null> {
    const found = await this.repo
      .createQueryBuilder('d')
      .where('d.ownerId = :ownerId', { ownerId })
      .andWhere("d.metadata ->> 'title' = :title", { title })
      .andWhere('d.status = :status', { status: DocumentStatus.DRAFT })
      .getOne();

    return found ? toDomain(found) : null;
  }

  async search(query: string, options?: any): Promise<Document[]> {
    // Simple JSONB full text search example — replace with Elastic/Meili in prod.
    const found = await this.repo
      .createQueryBuilder('d')
      .where(
        `d.metadata ->> 'title' ILIKE :q OR d.metadata ->> 'description' ILIKE :q`,
        { q: `%${query}%` },
      )
      .orderBy('d.updated_at', 'DESC')
      .getMany();
    return found.map(toDomain);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
