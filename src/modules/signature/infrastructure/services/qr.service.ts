export class QrService {
  /**
   * Payload để sinh QR. QR image tạo ở layer khác (frontend hoặc service riêng).
   * Payload nên ngắn: documentId + signatureId + hash + ts.
   */
  buildPayload(input: {
    documentId: string;
    signatureId: string;
    hashHex: string;
    timestampIso: string;
  }): string {
    return JSON.stringify({
      doc: input.documentId,
      sig: input.signatureId,
      h: input.hashHex,
      ts: input.timestampIso,
    });
  }
}
