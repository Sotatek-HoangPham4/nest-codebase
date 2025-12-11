import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePermissionOrm } from './role-permission.orm-entity';
import { UserRoleOrm } from './user-role.orm-entity';

@Entity('roles')
export class RoleOrm {
  @PrimaryColumn() id: string;
  @Column({ unique: true }) name: string;
  @Column({ nullable: true, type: 'text' }) description?: string | null;
  @CreateDateColumn({ type: 'timestamp' }) createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date | null;
  @OneToMany(() => RolePermissionOrm, (rp) => rp.role)
  permissions?: RolePermissionOrm[];
  @OneToMany(() => UserRoleOrm, (ur) => ur.role) userRoles?: UserRoleOrm[];
}
