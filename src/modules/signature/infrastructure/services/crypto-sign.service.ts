import { Injectable } from '@nestjs/common';
import { createHash, createSign, createVerify } from 'crypto';
import { SupportedAlgorithm } from './signature.service';

@Injectable()
export class CryptoSignService {
  hashSha256(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
  }

  signHashHex(params: {
    hashHex: string;
    privateKeyPem: string;
    algorithm: SupportedAlgorithm;
  }): string {
    // ký lên bytes của hashHex (MVP). Có thể đổi sang ký lên Buffer(hash)
    const algo = params.algorithm === 'ECDSA' ? 'sha256' : 'RSA-SHA256';
    const signer = createSign(algo);
    signer.update(params.hashHex);
    signer.end();
    return signer.sign(params.privateKeyPem).toString('base64');
  }

  verifyHashHex(params: {
    hashHex: string;
    signatureValueBase64: string;
    publicKeyPem: string;
    algorithm: SupportedAlgorithm;
  }): boolean {
    const algo = params.algorithm === 'ECDSA' ? 'sha256' : 'RSA-SHA256';
    const verifier = createVerify(algo);
    verifier.update(params.hashHex);
    verifier.end();
    return verifier.verify(
      params.publicKeyPem,
      Buffer.from(params.signatureValueBase64, 'base64'),
    );
  }
}
