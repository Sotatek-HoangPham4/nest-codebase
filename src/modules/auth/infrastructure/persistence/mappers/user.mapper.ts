import { User } from '../../../../user/domain/entities/user.entity';

export class UserMapper {
  static toResponse(user: User) {
    return {
      username: user.username,
      fullname: user.fullname,
      email: user.email.getValue(),
      phone_number: user.phone_number ?? null,
      avatar_url: user.avatar_url ?? null,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }
}
