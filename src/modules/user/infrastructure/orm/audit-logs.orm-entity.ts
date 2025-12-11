import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLogOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  action: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  created_at: Date;
}
