import { Injectable } from '@nestjs/common';

@Injectable()
export class PdfSignService {
  async attachSignatureInfo(params: {
    pdfBuffer: Buffer;

    documentId: string;
    signatureId: string;
    signerId: string;
    index: number;

    hashHex: string;
    timestampIso: string;
    qrPayload: string;

    userSignatureType: 'DRAWN' | 'DIGITAL';
    signatureImageBase64?: string;
  }): Promise<Buffer> {
    // MVP: nếu bạn chưa stamp thật, cứ return pdfBuffer để flow chạy OK.
    // Sau đó nâng cấp bằng pdf-lib: add QR image + text + signature image.
    return params.pdfBuffer;
  }
}
