import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sessions')
export class SessionOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  device: string;

  @Column()
  ipAddress: string;

  @Column()
  userAgent: string;

  @Column()
  refreshTokenHash: string;

  @Column({ default: false })
  isRevoked: boolean;

  @Column({ type: 'bigint' })
  lastUsedAt: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
