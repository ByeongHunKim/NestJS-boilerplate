import { Module } from '@nestjs/common'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { HttpModule } from '@nestjs/axios'
import { TimeService } from '@/src/common/time/time.service'

@Module({
  imports: [HttpModule],
  providers: [PrismaProvider, TimeService],
  exports: [HttpModule, PrismaProvider, TimeService],
})
export class CommonModule {}
