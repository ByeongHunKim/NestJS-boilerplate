import { Injectable } from '@nestjs/common'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { User, UserRole } from '@prisma/client'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaProvider) {}

  async find(offset: number, limit: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { role: UserRole.USER },
      orderBy: { id: 'asc' },
      skip: offset * limit,
      take: limit,
    })
  }
}
