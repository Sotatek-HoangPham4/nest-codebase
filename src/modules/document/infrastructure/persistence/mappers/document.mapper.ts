import {
  Document,
  DocumentVersion,
} from '../../../domain/entities/document.entity';
import { DocumentOrm } from '../orm/document.orm-entity';
import { DocumentStatus } from '../../../domain/value-objects/document-status.enum';

export const toDomain = (orm: DocumentOrm): Document => {
  const versions = (orm.versions || []).map(
    (v: any) =>
      new DocumentVersion(
        v.versionNumber,
        v.filePath,
        new Date(v.createdAt),
        v.createdBy,
        v.sha256,
        v.metadataSnapshot,
      ),
  );
  return new Document(
    orm.id,
    orm.ownerId,
    orm.content,
    orm.metadata || {},
    orm.status as DocumentStatus,
    versions,
    orm.collaborators || [],
    orm.createdAt,
    orm.updatedAt,
  );
};

export const toOrm = (doc: Document): Partial<DocumentOrm> => ({
  id: doc.id,
  ownerId: doc.ownerId,
  content: doc.content,
  metadata: doc.metadata,
  status: doc.status,
  versions: doc.versions.map((v) => ({
    versionNumber: v.versionNumber,
    filePath: v.filePath,
    createdAt: v.createdAt.toISOString(),
    createdBy: v.createdBy,
    sha256: v.sha256,
    metadataSnapshot: v.metadataSnapshot || {},
  })),
  collaborators: doc.collaborators || [],
});
