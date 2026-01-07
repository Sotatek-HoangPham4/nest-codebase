import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('organization_members')
export class OrganizationMemberOrm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  organizationId: string;

  @Column()
  userId: string;

  @Column()
  roleId: string;

  @CreateDateColumn()
  joinedAt: Date;
}
