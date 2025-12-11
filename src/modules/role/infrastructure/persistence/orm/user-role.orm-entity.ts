import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleOrm } from './role.orm-entity';

@Entity('user_roles')
export class UserRoleOrm {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() user_id: string;
  @Column() role_id: string;
  @ManyToOne(() => RoleOrm, (r) => r.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrm;
}
