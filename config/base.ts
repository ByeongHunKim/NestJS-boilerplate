import { getEnv, getEnvOrThrow } from '@/config/config.utils'

const base = {
  port: parseInt(getEnv('PORT', '8080'), 10),
  database: {
    url: getEnvOrThrow('DATABASE_URL'),
  },
  auth: {
    jwt: {
      secret: getEnvOrThrow('AUTH_JWT_SECRET'),
      algorithm: 'HS256',
      cookieDomain: 'test.kr',
      refreshToken: {
        expires: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
      accessToken: {
        expires: 60 * 60 * 1000, // 1 hour
      },
    },
  },
}

export default base
