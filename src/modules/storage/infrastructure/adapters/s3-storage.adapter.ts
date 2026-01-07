// import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
// import { IStorageService } from '../../domain/services/storage.service.interface';

// @Injectable()
// export class S3StorageAdapter implements IStorageService {
//   private readonly s3 = new S3({
//     accessKeyId: process.env.S3_KEY!,
//     secretAccessKey: process.env.S3_SECRET!,
//     region: process.env.S3_REGION!,
//   });

//   private readonly bucket = process.env.S3_BUCKET!;

//   async upload(
//     fileBuffer: Buffer,
//     fileName: string,
//     mimeType: string,
//   ): Promise<string> {
//     await this.s3
//       .upload({
//         Bucket: this.bucket,
//         Key: fileName,
//         Body: fileBuffer,
//         ContentType: mimeType,
//       })
//       .promise();

//     return `https://${this.bucket}.s3.amazonaws.com/${fileName}`;
//   }

//   async delete(filePath: string): Promise<void> {
//     await this.s3
//       .deleteObject({
//         Bucket: this.bucket,
//         Key: filePath,
//       })
//       .promise();
//   }
// }
