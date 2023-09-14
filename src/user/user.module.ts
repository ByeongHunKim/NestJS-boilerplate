import { Module } from '@nestjs/common'
import { CommonModule } from '@/src/common/CommonModule'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { UserService } from '@/src/user/user.service'
import { NameGenerator } from '@/src/user/name.generator'
import { UserController } from './user.controller'
import { UserRepository } from '@/src/user/user.repository'
import { UserMapper } from './user.mapper'

@Module({
  imports: [CommonModule],
  providers: [
    PrismaProvider,
    NameGenerator,
    UserService,
    UserRepository,
    UserMapper,
  ],
  exports: [UserService, NameGenerator, UserRepository], // TODO: why namegenerator should be exported? if remove, compile failed
  controllers: [UserController],
})
export class UserModule {}
