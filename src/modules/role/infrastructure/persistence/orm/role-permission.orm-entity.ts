import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RoleOrm } from './role.orm-entity';
import { PermissionOrmEntity } from '@/modules/permission/infrastructure/persistence/orm/permission.orm-entity';

@Entity('role_permissions')
export class RolePermissionOrm {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() role_id: string;
  @Column() permission_id: string;

  @ManyToOne(() => RoleOrm, (r) => r.permissions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleOrm;

  @ManyToOne(() => PermissionOrmEntity, { eager: true })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionOrmEntity;
}
