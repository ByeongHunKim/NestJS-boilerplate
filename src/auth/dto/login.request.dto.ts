import { User } from '@prisma/client'

export type SocialLoginRequestDto = Required<
  Pick<User, 'email' | 'socialId' | 'socialType'>
>

export type LocalLoginRequestDto = Required<Pick<User, 'username' | 'password'>>
