import { User } from '@prisma/client'

type SimpleCommonUserCreateDto = Pick<User, 'email' | 'loginType'>

export type SimpleLocalUserCreateDto = SimpleCommonUserCreateDto &
  Pick<User, 'username' | 'password'>
export type SimpleUserCreateDto = SimpleLocalUserCreateDto

export type RequiredUserCreateDto = Required<Pick<User, 'nickName' | 'role'>>
export type LocalUserCreateDto = SimpleLocalUserCreateDto &
  RequiredUserCreateDto