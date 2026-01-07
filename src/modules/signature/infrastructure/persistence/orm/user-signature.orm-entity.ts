import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('user_signatures')
@Index(['userId', 'status'])
export class UserSignatureOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  type: string;

  @Column({ type: 'text', nullable: true })
  signatureImageBase64?: string;

  @Column({ type: 'text', nullable: true })
  publicKeyPem?: string;

  @Column()
  status: string; // ACTIVE/REVOKED

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  revokedAt?: Date | null;
}
