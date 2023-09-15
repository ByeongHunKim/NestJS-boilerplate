import { Injectable } from '@nestjs/common'
import { CommonMapper } from '@/src/lib/mapper/CommonMapper'
import { User } from '@prisma/client'
import { UserDto } from '@/src/user/dto/user.dto'

@Injectable()
export class UserMapper extends CommonMapper {
  mapUsersToUserDtos(users: User[]): UserDto[] {
    return users.map(this.mapUserToUserDto)
  }

  // todo mapSourceToTarget() 사용 필요
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
