import { Module } from '@nestjs/common'
import { CustomLogger } from '@/src/logger.service'

@Module({
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class LoggerModule {}
