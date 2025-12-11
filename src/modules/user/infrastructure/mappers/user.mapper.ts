import { SessionOrmEntity } from '@/modules/session/infrastructure/persistence/orm/session.orm-entity';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserOrmEntity } from '../orm/user.orm-entity';

export class UserMapper {
  static toDomain(record: UserOrmEntity): User {
    return new User({
      id: record.id,
      username: record.username,
      fullname: record.fullname,
      email: new Email(record.email),
      password: record.password,
      phone_number: record.phone_number ?? null,
      avatar_url: record.avatar_url ?? null,
      provider: record.provider,
      role: record.role,
      is_verified: record.is_verified,
      two_factor_enabled: record.two_factor_enabled,
      two_factor_secret: record.two_factor_secret ?? null,
      is_active: record.is_active,
      is_locked: record.is_locked,
      failed_attempts: record.failed_attempts,
      settings: record.settings,
      created_at: record.created_at,
      updated_at: record.updated_at,
    });
  }

  static toOrm(entity: User): Partial<any> {
    return entity.getProps();
  }
}
