import { Collaborator } from '../../domain/entities/document.entity';

export type DocumentVersionKind = 'BASE' | 'SIGNED';

export interface DocumentVersionJson {
  versionNumber: number;
  filePath: string;
  createdAt: string; // ISO
  createdBy: string;
  sha256?: string;

  kind: DocumentVersionKind;
  baseVersionNumber?: number; // signed version derived from which base
  signatureId?: string; // if SIGNED
  signerId?: string; // if SIGNED
  signerIndex?: number; // if SIGNED
}

export class DocumentResponseDto {
  id: string;
  ownerId: string;

  content: any;

  metadata: any;

  status: string;

  versions: DocumentVersionJson[];

  collaborators: Collaborator[];

  createdAt: string;
  updatedAt: string;

  static toResponse(doc: any): DocumentResponseDto {
    return {
      id: doc.id,
      ownerId: doc.ownerId,
      content: doc.content,
      metadata: doc.metadata,
      status: doc.status,
      versions: doc.versions || [],

      collaborators: (doc.collaborators || []).map((c: any) => ({
        user_id: c.user_id,
        role: c.role,
        added_at:
          c.added_at?.toISOString?.() ??
          (typeof c.added_at === 'string' ? c.added_at : null),
      })),

      createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
      updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
    };
  }
}
