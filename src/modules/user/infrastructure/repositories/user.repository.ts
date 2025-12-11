import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { UserOrmEntity } from '../orm/user.orm-entity';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { AuditLogOrmEntity } from '../orm/audit-logs.orm-entity';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
  ) {}

  async create(user: User): Promise<User> {
    const record = this.userRepo.create({
      username: user.username,
      fullname: user.fullname,
      email: user.email.getValue(),
      password: user.password,
      phone_number: user.phone_number ?? null,
      avatar_url: user.avatar_url ?? null,
      provider: user.provider,
      role: user.role,
      is_active: user.is_active ?? true,
      is_verified: user.is_verified ?? false,
      two_factor_enabled: user.two_factor_enabled ?? false,
      two_factor_secret: user.two_factor_secret ?? null,
      created_at: user.created_at ?? new Date(),
      updated_at: user.updated_at ?? new Date(),
    } as Partial<UserOrmEntity>);

    const saved = await this.userRepo.save(record);
    return UserMapper.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.userRepo.findOne({ where: { id } });
    if (!record) return null;
    return UserMapper.toDomain(record);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.userRepo.findOne({
      where: { email: email.getValue() },
    });

    if (!record) return null;
    return UserMapper.toDomain(record);
  }

  async findByUsername(username: string): Promise<User | null> {
    const record = await this.userRepo.findOne({
      where: { username },
    });

    if (!record) return null;
    return UserMapper.toDomain(record);
  }

  async update(user: User): Promise<User> {
    console.log(user);
    if (!user.id) throw new Error('Cannot update user without an ID');

    const ormUser = await this.userRepo.findOne({ where: { id: user.id } });
    if (!ormUser)
      throw new NotFoundException(`User with id ${user.id} not found`);

    // Map domain -> ORM
    ormUser.username = user.username;
    ormUser.fullname = user.fullname;
    ormUser.email = user.email.getValue();
    ormUser.phone_number = user.phone_number! ?? null;
    ormUser.avatar_url = user.avatar_url! ?? null;
    ormUser.role = user.role;
    ormUser.is_active = user.is_active;
    ormUser.is_verified = user.is_verified;
    ormUser.two_factor_enabled = user.two_factor_enabled;
    ormUser.two_factor_secret = user.two_factor_secret! ?? null;
    ormUser.updated_at = new Date();

    const saved = await this.userRepo.save(ormUser);
    return UserMapper.toDomain(saved);
  }

  async softDelete(id: string): Promise<void> {
    const result = await this.userRepo.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async saveSettings(id: string, settings: Record<string, any>) {
    await this.userRepo.update(id, { settings });
  }
}
