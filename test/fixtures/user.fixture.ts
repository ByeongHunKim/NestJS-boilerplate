import { LoginType, User, UserRole } from '@prisma/client'

export const testUser: User = {
  id: 1,
  email: 'test@gmail.com',
  nickName: 'mock1',
  role: UserRole.USER,
  loginType: LoginType.LOCAL,
  username: 'mockUser',
  password: 'mockPassword',
  refreshToken: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}
