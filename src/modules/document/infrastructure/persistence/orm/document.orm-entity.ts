import { Collaborator } from '@/modules/document/domain/entities/document.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'documents' })
export class DocumentOrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'owner_id' })
  ownerId: string;

  @Column({ type: 'jsonb', default: [] })
  content: any;

  @Column({ type: 'jsonb', default: {} })
  metadata: any;

  @Column({ type: 'varchar', default: 'draft' })
  status: string;

  // store versions in JSONB array; each item: {versionNumber, filePath, createdAt, createdBy, sha256, metadataSnapshot}
  @Column({ type: 'jsonb', default: [] })
  versions: any[];

  @Column({ type: 'jsonb', nullable: true })
  collaborators: Collaborator[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
