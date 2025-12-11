export class RegisterDto {
  username: string;
  fullname: string;
  email: string;
  password: string;
  provider?: string;
}

export class RegisterResponseDto {
  id: string;
  username: string;
  fullname: string;
  email: string;

  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
