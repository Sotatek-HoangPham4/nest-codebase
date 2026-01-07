import { UserSignatureEntity } from '../entities/user-signature.entity';

export const USER_SIGNATURE_REPOSITORY = Symbol('USER_SIGNATURE_REPOSITORY');

export interface UserSignatureRepositoryInterface {
  findActiveByUserId(userId: string): Promise<UserSignatureEntity | null>;
  findById(id: string): Promise<UserSignatureEntity | null>;
  create(entity: UserSignatureEntity): Promise<UserSignatureEntity>;
  save(entity: UserSignatureEntity): Promise<UserSignatureEntity>;
}
