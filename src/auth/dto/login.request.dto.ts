import { User } from '@prisma/client'

export type LocalLoginRequestDto = Required<Pick<User, 'username' | 'password'>>
