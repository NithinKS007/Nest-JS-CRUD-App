import { Module } from '@nestjs/common';
import { HashingService } from './hashing.service';
import { HASHING_SERVICE } from './hashing.interface';

@Module({
  providers: [
    {
      provide: HASHING_SERVICE,
      useClass: HashingService,
    },
  ],
  exports: [HASHING_SERVICE],
})
export class HashingModule {}
