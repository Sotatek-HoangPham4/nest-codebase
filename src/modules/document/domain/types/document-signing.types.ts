// modules/document/domain/types/document-signing.types.ts
export type SigningStatus =
  | 'DRAFT'
  | 'READY_TO_SIGN'
  | 'SIGNING'
  | 'SIGNED'
  | 'CANCELLED';
export type SigningOrder = 'SEQUENTIAL' | 'PARALLEL';
export type AllowedSignatureType = 'DRAW' | 'TYPE' | 'UPLOAD' | 'CLOUD';

export interface SigningPolicy {
  allowedSignatureTypes: AllowedSignatureType[];
  requireOtp: boolean;
  signingOrder: SigningOrder; // MVP: SEQUENTIAL
  requireAllSigners: boolean; // MVP: true
  qrVerify: {
    enabled: boolean;
    mode: 'PUBLIC' | 'PRIVATE';
    payloadFields: Array<'documentId' | 'signatureId' | 'hash' | 'timestamp'>;
  };
}

export interface SignerSpec {
  userId: string;
  index: number;
  required: boolean;
}

export interface SignatureRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PlacementSpec {
  placementId: string;
  signerId: string; // userId
  index: number;
  page: number; // 1-based
  rect: SignatureRect;
  required: boolean;
}

export interface SigningMetadata {
  status: SigningStatus;
  policy: SigningPolicy;
  participants: {
    ownerId: string;
    signers: SignerSpec[];
    permissions: {
      editors: string[];
      viewers: string[];
      downloaders: string[];
    };
  };
  placements: PlacementSpec[];
  deploy: {
    deployedAt: string | null;
    deployedBy: string | null;
    baseVersionNumber: number | null;
  };
}

export function getSigningMetadata(metadata: any): SigningMetadata | null {
  return metadata?.signing ?? null;
}
