import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { LoginType, User, UserRole } from '@prisma/client'
import {
  LocalUserCreateDto,
  RequiredUserCreateDto,
  SimpleLocalUserCreateDto,
  SimpleUserCreateDto,
} from '@/src/user/dto/user.create.dto'
import { NameGenerator } from '@/src/user/name.generator'
import invariant from 'tiny-invariant'
import { comparePassword, hashPassword } from '@/src/user/password.util'
import { UserDto } from '@/src/user/dto/user.dto'
import EntityNotFoundError from '@/src/error/NotFoundError'
import EntityConflictError from '@/src/error/ConflictError'

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaProvider,
    private nameGenerator: NameGenerator,
  ) {}

  async find(offset = 0, limit = 100): Promise<UserDto[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: UserRole.USER,
      },
      orderBy: {
        id: 'asc',
      },
      skip: offset * limit,
      take: limit,
    })
    return this.mapUsersToUserDtos(users)
  }

  async findById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    })
  }

  async validateUserExists(id: number): Promise<User> {
    const user = await this.findById(id)
    if (!user) {
      throw new EntityNotFoundError(`User id: ${id} not exist`)
    }
    return user
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

  async isExistByUsername(username: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        username,
      },
    })
    return !!user
  }

  // TODO: apply userId, password policy (e.g. minLen)
  async createLocalUser(createDto: SimpleLocalUserCreateDto): Promise<User> {
    invariant(createDto.loginType === LoginType.LOCAL, 'Invalid loginType')
    invariant(createDto.username?.length > 0, 'Invalid loginId')
    invariant(createDto.password?.length > 0, 'Invalid password')

    await this.setDefaultUserProperties(createDto)

    const isUsernameDuplicated = await this.isExistByUsername(
      createDto.username,
    )
    if (isUsernameDuplicated) {
      throw new EntityConflictError(
        `username: ${createDto.username} duplicated`,
      )
    }

    const fullCreateDto: LocalUserCreateDto = createDto as LocalUserCreateDto
    const hash = await hashPassword(fullCreateDto.password)
    return this.prisma.user.create({
      data: {
        ...fullCreateDto,
        password: hash,
      },
    })
  }

  private async setDefaultUserProperties(
    createDto: SimpleUserCreateDto & Partial<RequiredUserCreateDto>,
  ) {
    createDto.role = UserRole.USER
    createDto.nickName = createDto.nickName
      ? createDto.nickName
      : await this.genNotConflictedRandomNickname()
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

  async validateLocalUser(username: string, password: string): Promise<User> {
    const user = await this.findByUsername(username)
    if (!user) {
      throw new UnauthorizedException(`User (username: ${username}) not exist`)
    }

    const matched = comparePassword(user.password, password)
    if (!matched) {
      throw new UnauthorizedException(
        `User(username: ${username}) password does not matched`,
      )
    }

    return user
  }

  async genNotConflictedRandomNickname() {
    const maxRetry = 5
    let retry = 0
    do {
      const candidate = this.nameGenerator.generateRandomName()
      const existedUser = await this.prisma.user.findFirst({
        where: {
          nickName: candidate,
        },
      })
      if (!existedUser) {
        return candidate
      }
      retry++
    } while (retry < maxRetry)

    throw new Error('genNotConflictedRandomNickname() exceeded max retry')
  }

  private mapUsersToUserDtos(users: User[]): UserDto[] {
    return users.map(this.mapUserToUserDto)
  }

  mapUserToUserDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email,
      nickName: user.nickName,
      loginType: user.loginType,
      username: user.username,
      createdAt: user.createdAt,
    }
  }
}
