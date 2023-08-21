import { Module } from '@nestjs/common'
import { CommonModule } from '@/src/common/CommonModule'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { UserService } from '@/src/user/user.service'
import { NameGenerator } from '@/src/user/name.generator'
import { UserController } from './user.controller'

@Module({
  imports: [CommonModule],
  providers: [PrismaProvider, NameGenerator, UserService],
  exports: [UserService, NameGenerator], // TODO: why namegenerator should be exported? if remove, compile failed
  controllers: [UserController],
})
export class UserModule {}
