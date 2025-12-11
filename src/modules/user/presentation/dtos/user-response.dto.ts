import { User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  static toResponse(entity: User) {
    return {
      id: entity.id,
      username: entity.username,
      fullname: entity.fullname,
      email: entity.email.getValue(),
      phone_number: entity.phone_number,
      avatar_url: entity.avatar_url,
      role: entity.role,
      createdAt: entity.created_at?.toISOString?.() ?? entity.created_at,
      updatedAt: entity.updated_at?.toISOString?.() ?? entity.updated_at,
    };
  }
}
