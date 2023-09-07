import { Injectable } from '@nestjs/common'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { User, UserRole } from '@prisma/client'
import { LocalUserCreateDto } from '@/src/user/dto/user.create.dto'

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
