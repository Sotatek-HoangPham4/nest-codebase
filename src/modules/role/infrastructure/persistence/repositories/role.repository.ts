import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  IRoleRepository,
  IRoleRepositoryToken,
} from '../../../domain/repositories/role.repository.interface';
import { RoleOrm } from '../orm/role.orm-entity';
import { RolePermissionOrm } from '../orm/role-permission.orm-entity';
import { UserRoleOrm } from '../orm/user-role.orm-entity';
import { RoleEntity } from '../../../domain/entities/role.entity';
import { RoleMapper } from '../mappers/role.mapper';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@/modules/permission/domain/entities/permission.entity';
import { PermissionMapper } from '@/modules/permission/infrastructure/persistence/mappers/permission.mapper';

@Injectable()
export class RoleRepository implements IRoleRepository {
  constructor(
    @InjectRepository(RoleOrm) private readonly roleRepo: Repository<RoleOrm>,
    @InjectRepository(RolePermissionOrm)
    private readonly rolePermRepo: Repository<RolePermissionOrm>,
    @InjectRepository(UserRoleOrm)
    private readonly userRoleRepo: Repository<UserRoleOrm>,
  ) {}

  async save(role: RoleEntity): Promise<void> {
    const orm = RoleMapper.toOrm(role);
    await this.roleRepo.save(orm);
  }

  async findById(id: string): Promise<RoleEntity | null> {
    const orm = await this.roleRepo.findOne({ where: { id } });
    if (!orm) return null;
    return RoleMapper.toDomain(orm);
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    const orm = await this.roleRepo.findOne({ where: { name } });
    if (!orm) return null;
    return RoleMapper.toDomain(orm);
  }

  async findPublicAssignableRoles() {
    const rows = await this.roleRepo.find({
      order: { name: 'ASC' },
    });

    const blocked = new Set(['admin', 'super_admin']);
    return rows.filter((r) => !blocked.has(r.name));
  }

  async assignPermission(roleId: string, permissionId: string): Promise<void> {
    const exists = await this.rolePermRepo.findOne({
      where: { role_id: roleId, permission_id: permissionId },
    });
    if (exists) return;
    await this.rolePermRepo.save(
      this.rolePermRepo.create({
        role_id: roleId,
        permission_id: permissionId,
      }),
    );
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await this.rolePermRepo.delete({
      role_id: roleId,
      permission_id: permissionId,
    });
  }

  async getRolePermissionIds(roleId: string): Promise<string[]> {
    const rows = await this.rolePermRepo.find({ where: { role_id: roleId } });
    return rows.map((r) => r.permission_id);
  }

  async getRolePermissions(roleId: string): Promise<Permission[]> {
    const rows = await this.rolePermRepo.find({
      where: { role_id: roleId },
      relations: ['permission'],
    });

    return rows.map((row) => PermissionMapper.toDomain(row.permission));
  }

  async assignRoleToUser(roleId: string, userId: string): Promise<void> {
    const exists = await this.userRoleRepo.findOne({
      where: { role_id: roleId, user_id: userId },
    });
    if (exists) return;
    await this.userRoleRepo.save(
      this.userRoleRepo.create({ role_id: roleId, user_id: userId }),
    );
  }

  async getUserRoleIds(userId: string): Promise<string[]> {
    const rows = await this.userRoleRepo.find({ where: { user_id: userId } });
    return rows.map((r) => r.role_id);
  }

  async getUserRoles(userId: string): Promise<{ id: string; name: string }[]> {
    const rows = await this.roleRepo
      .createQueryBuilder('r')
      .innerJoin('user_roles', 'ur', 'ur.role_id = r.id')
      .where('ur.user_id = :userId', { userId })
      .select(['r.id', 'r.name'])
      .getRawMany();
    return rows.map((r: any) => ({
      id: r.r_id ?? r.id,
      name: r.r_name ?? r.name,
    }));
  }
}
