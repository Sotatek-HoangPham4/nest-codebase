export class RefreshDto {
  access_token: string;
}

export class RefreshResponseDto {
  access_token: string;
  expires_in: number;
}
