import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('signatures')
@Index(['documentId'])
@Index(['documentId', 'index'])
export class SignatureOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  documentId: string;

  @Column()
  signerId: string;

  @Column()
  type: string; // SignatureType

  @Column({ type: 'int' })
  index: number;

  @Column({ nullable: true })
  publicKeyPem?: string;

  @Column({ nullable: true })
  algorithm?: string; // RSA/ECDSA

  @Column({ type: 'text', nullable: true })
  signatureValueBase64?: string;

  @Column({ nullable: true })
  signedHashHex?: string;

  @Column({ nullable: true })
  timestampIso?: string;

  @Column({ type: 'text', nullable: true })
  qrPayload?: string;

  @Column()
  status: string; // PENDING/SIGNED/REVOKED

  @Column({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz' })
  updatedAt: Date;
}
