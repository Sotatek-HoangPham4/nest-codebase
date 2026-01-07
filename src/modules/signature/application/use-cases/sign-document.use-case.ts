import {
  Inject,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';

import { DocumentOrm } from '@/modules/document/infrastructure/persistence/orm/document.orm-entity';
import { FileStorageService } from '../../infrastructure/services/file-storage.service';

import {
  SIGNATURE_REPOSITORY,
  type SignatureRepositoryInterface,
} from '../../domain/repositories/signature.repository.interface';

import {
  USER_SIGNATURE_REPOSITORY,
  type UserSignatureRepositoryInterface,
} from '../../domain/repositories/user-signature.repository.interface';

import { SignatureService } from '../../infrastructure/services/signature.service';
import { SignRequestDto } from '../dtos/sign-request.dto';
import { SignResponseDto } from '../dtos/sign-response.dto';

type DocumentVersionJson = {
  versionNumber: number;
  filePath: string;
  sha256?: string;
  kind?: 'BASE' | 'SIGNED';
  signatureId?: string;
  signerId?: string;
  signerIndex?: number;
  baseVersionNumber?: number;
  createdAt?: string;
  createdBy?: string;
};

function sha256Hex(buf: Buffer) {
  return createHash('sha256').update(buf).digest('hex');
}

function getLatestVersion(versions: DocumentVersionJson[]) {
  if (!versions.length) return null;
  return versions.reduce((a, b) => (a.versionNumber > b.versionNumber ? a : b));
}

@Injectable()
export class SignDocumentUseCase {
  constructor(
    @Inject(SIGNATURE_REPOSITORY)
    private readonly repo: SignatureRepositoryInterface,

    @Inject(USER_SIGNATURE_REPOSITORY)
    private readonly userSignatureRepo: UserSignatureRepositoryInterface,

    @InjectRepository(DocumentOrm)
    private readonly docRepo: Repository<DocumentOrm>,

    private readonly storage: FileStorageService,
    private readonly signatureService: SignatureService,
  ) {}

  async execute(dto: SignRequestDto): Promise<SignResponseDto> {
    if (!dto.signerId)
      throw new BadRequestException('signerId missing (CurrentUser)');
    if (!dto.otpToken) throw new BadRequestException('OTP token is required');

    // 1) load document + metadata signing
    const doc = await this.docRepo.findOne({ where: { id: dto.documentId } });
    if (!doc) throw new BadRequestException('Document not found');

    const signing = doc.metadata?.signing;
    if (!signing)
      throw new BadRequestException('Document has no signing metadata');
    if (!signing.deploy?.baseVersionNumber)
      throw new BadRequestException('Document not deployed for signing');

    // 2) load signature task (PENDING) created at deploy
    const task = await this.repo.findByDocumentSignerIndex(
      dto.documentId,
      dto.signerId,
      dto.index,
    );
    if (!task)
      throw new ForbiddenException('No signing task for this signer/index');

    const s = task.snapshot;
    if (s.status !== 'PENDING')
      throw new BadRequestException('Signature task is not PENDING');

    // 3) enforce sequential
    if ((signing.policy?.signingOrder ?? 'SEQUENTIAL') === 'SEQUENTIAL') {
      const all = await this.repo.findByDocumentId(dto.documentId);
      const notDonePrev = all
        .map((x) => x.snapshot)
        .filter((x) => x.index.get() < dto.index && x.status !== 'SIGNED');

      if (notDonePrev.length) throw new BadRequestException('Chưa đến lượt ký');
    }

    // 4) ensure user has ACTIVE profile signature
    const activeUserSig = await this.userSignatureRepo.findActiveByUserId(
      dto.signerId,
    );
    if (!activeUserSig)
      throw new BadRequestException('User has no ACTIVE signature profile');
    const us = activeUserSig.snapshot;

    if (!us.signatureImageBase64) {
      throw new BadRequestException(
        'ACTIVE user signature has no signatureImageBase64',
      );
    }

    // 5) choose input PDF version (MVP chain signing: sign on latest)
    const versions: DocumentVersionJson[] = Array.isArray(doc.versions)
      ? doc.versions
      : [];
    const latest = getLatestVersion(versions);
    if (!latest?.filePath)
      throw new BadRequestException('No PDF version to sign');

    const inputPdf = await this.storage.read(latest.filePath);

    // 6) placement lookup
    const placement = (signing.placements ?? []).find(
      (p: any) => p.signerId === dto.signerId && p.index === dto.index,
    );
    if (!placement)
      throw new BadRequestException(
        'No placement configured for this signer/index',
      );

    // 7) sign/stamp (SignatureService should embed PNG + timestamp + QR)
    // Lưu ý: dto.type là "task type", còn us.type là "profile signature type".
    const renderSigType: 'DRAWN' | 'DIGITAL' =
      String(us.type).toUpperCase() === 'TYPE' ? 'DIGITAL' : 'DRAWN';

    const signed = await this.signatureService.signDocument({
      pdfBuffer: inputPdf,
      documentId: dto.documentId,
      signatureId: s.id,
      signerId: dto.signerId,
      index: dto.index,

      userSignatureType: renderSigType,
      signatureImageBase64: us.signatureImageBase64,
      publicKeyPem: us.publicKeyPem,

      algorithm: 'RSA',
      privateKeyPem: dto.privateKeyPem!, // nếu bạn vẫn demo theo kiểu này
    });

    // 8) save signed pdf as new document version with mapping signatureId
    const nowIso = signed.timestampIso ?? new Date().toISOString();
    const hashHex = signed.hashHex ?? sha256Hex(signed.signedPdfBuffer);

    const nextVersionNumber =
      (getLatestVersion(versions)?.versionNumber ?? 0) + 1;
    const signedPath = `documents/${doc.id}/signed_v${nextVersionNumber}_sig_${s.id}.pdf`;

    // await this.storage.write(signedPath, signed.signedPdfBuffer);

    const signedVersion: DocumentVersionJson = {
      versionNumber: nextVersionNumber,
      filePath: signedPath,
      sha256: hashHex,
      kind: 'SIGNED',
      baseVersionNumber: signing.deploy.baseVersionNumber,
      signatureId: s.id,
      signerId: dto.signerId,
      signerIndex: dto.index,
      createdAt: nowIso,
      createdBy: dto.signerId,
    };

    doc.versions = [...versions, signedVersion];

    // 9) mark signature task SIGNED
    task.markSigned({
      signatureValueBase64: signed.signatureValueBase64,
      signedHashHex: hashHex,
      algorithm: 'RSA',
      timestampIso: nowIso,
      qrPayload: signed.qrPayload,
      publicKeyPem: us.publicKeyPem,
    });

    await this.repo.save(task);

    // 10) update document status (SIGNING / SIGNED)
    const allAfter = await this.repo.findByDocumentId(dto.documentId);
    const allSigned = allAfter.every((x) => x.snapshot.status === 'SIGNED');

    signing.status = allSigned ? 'SIGNED' : 'SIGNING';
    doc.status = allSigned ? 'SIGNED' : 'SIGNING';
    doc.metadata = { ...(doc.metadata ?? {}), signing };

    await this.docRepo.save(doc);

    return {
      signatureId: s.id,
      documentId: dto.documentId,
      signerId: dto.signerId,
      type: dto.type,
      index: dto.index,
      signedHashHex: hashHex,
      timestampIso: nowIso,
      qrPayload: signed.qrPayload,
      signedPdfBase64: signed.signedPdfBuffer.toString('base64'),
    };
  }
}
