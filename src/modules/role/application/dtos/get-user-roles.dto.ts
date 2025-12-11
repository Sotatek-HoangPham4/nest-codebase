import { IsString } from 'class-validator';
export class GetUserRolesDto {
  @IsString() userId: string;
}
