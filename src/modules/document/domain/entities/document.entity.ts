import { DocumentStatus } from '../value-objects/document-status.enum';

export type DocumentId = string;

export interface DocumentMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  templateId?: string | null;
  [k: string]: any;
}

export interface Collaborator {
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  added_at: Date;
}

export class DocumentVersion {
  constructor(
    public versionNumber: number,
    public filePath: string,
    public createdAt: Date,
    public createdBy: string,
    public sha256?: string,
    public metadataSnapshot?: DocumentMetadata,
  ) {}
}

export class Document {
  constructor(
    public id: DocumentId,
    public ownerId: string,
    public content: Record<string, any>,
    public metadata: DocumentMetadata,
    public status: DocumentStatus = DocumentStatus.DRAFT,
    public versions: DocumentVersion[] = [],
    public collaborators: Collaborator[] = [],
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  addVersion(v: DocumentVersion) {
    this.versions.push(v);
    this.updatedAt = new Date();
  }

  latestVersion(): DocumentVersion | null {
    if (!this.versions.length) return null;
    return this.versions[this.versions.length - 1];
  }

  setStatus(status: DocumentStatus) {
    this.status = status;
    this.updatedAt = new Date();
  }

  addCollaborator(c: Collaborator) {
    this.collaborators.push(c);
    this.updatedAt = new Date();
  }
}
