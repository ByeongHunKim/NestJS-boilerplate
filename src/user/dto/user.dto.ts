import { User } from '@prisma/client'

export type UserDto = Pick<
  User,
  'id' | 'email' | 'nickName' | 'loginType' | 'username' | 'createdAt'
>
