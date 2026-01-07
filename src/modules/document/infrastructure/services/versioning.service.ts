import { Injectable } from '@nestjs/common';
import crypto from 'crypto';

@Injectable()
export class VersioningService {
  computeSha256(buffer: Buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  buildStoragePath(
    documentId: string,
    versionNumber: number,
    filename = 'doc.pdf',
  ) {
    return `documents/${documentId}/v${versionNumber}/${Date.now()}_${filename}`;
  }
}
