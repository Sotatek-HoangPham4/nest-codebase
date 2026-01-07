import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('organizations')
export class OrganizationOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  owner_id: string;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
