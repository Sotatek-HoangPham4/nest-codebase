import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileUseCase } from '../../application/use-cases/upload-file.use-case';

@Controller('storage')
export class StorageController {
  constructor(private readonly uploadFile: UploadFileUseCase) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.uploadFile.execute(file);
  }
}
