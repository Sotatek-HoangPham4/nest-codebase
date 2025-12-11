import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  log(message: string) {
    this.logger.log(message);
  }
}
