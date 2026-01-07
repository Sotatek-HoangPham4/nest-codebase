import { SignatureEntity } from '../entities/signature.entity';

export const SIGNATURE_REPOSITORY = Symbol('SIGNATURE_REPOSITORY');

export interface SignatureRepositoryInterface {
  // basic CRUD
  findById(id: string): Promise<SignatureEntity | null>;
  create(entity: SignatureEntity): Promise<SignatureEntity>;
  save(entity: SignatureEntity): Promise<SignatureEntity>;

  // queries for signing flow
  findByDocumentIdAndIndex(
    documentId: string,
    index: number,
  ): Promise<SignatureEntity | null>;
  findSignedByDocumentId(documentId: string): Promise<SignatureEntity[]>;
  findPendingByDocumentId(documentId: string): Promise<SignatureEntity[]>;

  // sequential check (index-1 must be SIGNED)
  isPreviousIndexSigned(documentId: string, index: number): Promise<boolean>;

  findByDocumentId(documentId: string): Promise<SignatureEntity[]>;
  findByDocumentSignerIndex(
    documentId: string,
    signerId: string,
    index: number,
  ): Promise<SignatureEntity | null>;
}
