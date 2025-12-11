import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Column({ name: 'full_name' })
  fullname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column()
  provider: string;

  @Column()
  role: string;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ default: false })
  two_factor_enabled: boolean;

  @Column({ nullable: true })
  two_factor_secret: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ default: false })
  is_locked: boolean;

  @Column({ default: 0 })
  failed_attempts: number;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
