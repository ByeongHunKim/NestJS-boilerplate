import { exit } from 'node:process'
import { LoginType, PrismaClient, UserRole } from '@prisma/client'
import { hashPassword } from '../src/user/password.util'

const prisma = new PrismaClient()

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    exit(1)
  })

async function main() {
  await seedUsers()
  console.log('seed completed!')
}

async function seedUsers() {
  const users = [
    {
      email: 'seed1-user@gmail.com',
      nickName: 'user1',
      role: UserRole.USER,
      loginType: LoginType.LOCAL,
      username: 'user1',
      password: await hashPassword('local1'),
    },
    {
      email: 'seed2-user@gmail.com',
      nickName: 'user2',
      role: UserRole.USER,
      loginType: LoginType.LOCAL,
      username: 'user2',
      password: await hashPassword('local2'),
    },
    {
      email: 'seed2-admin@gmail.com',
      nickName: 'admin',
      role: UserRole.ADMIN,
      loginType: LoginType.LOCAL,
      username: 'admin',
      password: await hashPassword('local'),
    },
  ]

  for (const user of users) {
    const existed = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    })

    if (!existed) {
      await prisma.user.create({
        data: user,
      })
    }
  }
}
