import { Document, DocumentId } from '../entities/document.entity';

export const DOCUMENT_REPOSITORY = 'DOCUMENT_REPOSITORY';

export interface DocumentRepository {
  create(doc: Document): Promise<Document>;
  save(doc: Document): Promise<Document>;
  findById(id: DocumentId): Promise<Document | null>;
  findByOwner(
    ownerId: string,
    options?: { limit?: number; offset?: number },
  ): Promise<Document[]>;
  findByOwnerAndTitle(ownerId: string, title: string): Promise<Document | null>;
  search(query: string, options?: any): Promise<Document[]>;
  delete(id: DocumentId): Promise<void>;
}
