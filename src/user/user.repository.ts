import { Injectable } from '@nestjs/common'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { User, UserRole } from '@prisma/client'
import { LocalUserCreateDto } from '@/src/user/dto/user.create.dto'
import invariant from 'tiny-invariant'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaProvider) {}

  async find(offset: number, limit: number): Promise<User[]> {
    invariant(offset >= 0, 'offset should be >= 0')
    invariant(limit > 0, 'limit should be > 0')

    return this.prisma.user.findMany({
      where: { role: UserRole.USER },
      orderBy: { id: 'asc' },
      skip: offset * limit,
      take: limit,
    })
  }

  async findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async findByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    })
  }

  async findByUsername(username: string): Promise<User> {
    return this.prisma.user.findFirst({
      where: {
        username,
      },
    })
  }

  async createLocalUser(createDto: LocalUserCreateDto): Promise<User> {
    return this.prisma.user.create({
      data: createDto,
    })
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        refreshToken,
      },
    })
  }
}
