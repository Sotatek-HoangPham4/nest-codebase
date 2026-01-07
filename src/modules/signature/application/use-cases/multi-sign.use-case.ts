import { Injectable } from '@nestjs/common';
import { SignDocumentUseCase } from './sign-document.use-case';
import { SignRequestDto } from '../dtos/sign-request.dto';
import { SignResponseDto } from '../dtos/sign-response.dto';

@Injectable()
export class MultiSignUseCase {
  constructor(private readonly signOne: SignDocumentUseCase) {}

  async execute(requests: SignRequestDto[]): Promise<SignResponseDto[]> {
    const results: SignResponseDto[] = []; // ✅ FIX: không để TS suy ra never[]
    for (const req of requests) {
      const signed = await this.signOne.execute(req);
      results.push(signed);
    }
    return results;
  }
}
