import { Injectable } from '@nestjs/common'
import { CommonMapper } from '@/src/lib/mapper/CommonMapper'
import { User } from '@prisma/client'
import { UserDto } from '@/src/user/dto/user.dto'

@Injectable()
export class UserMapper extends CommonMapper {
  mapUsersToUserDtos(users: User[]): UserDto[] {
    return users.map((user) => this.mapUserToUserDto(user))
  }

  mapUserToUserDto(user: User): UserDto {
    const target = new UserDto()
    // mapSourceToTarget 사용
    this.mapSourceToTarget(user, target)
    return target
  }
}
