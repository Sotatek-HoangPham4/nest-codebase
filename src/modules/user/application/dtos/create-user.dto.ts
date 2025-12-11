export class CreateUserDto {
  username: string;
  fullname: string;
  email: string;
  password: string;
  phone_number?: string;
  avatar_url?: string;
  provider?: string;
  role?: string;
}
