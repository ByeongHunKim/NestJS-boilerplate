export interface Config {
  port: number
  database: {
    url: string
  }
  auth: {
    jwt: {
      issuer: string
      secret: string
      algorithm: string
      cookieDomain: string
      refreshToken: {
        expires: number
      }
      accessToken: {
        expires: number
      }
    }
  }
}

export default (): Config => ({
  port: parseInt(process.env.PORT, 10) || 8080,
  database: {
    url: process.env.DATABASE_URL,
  },
  auth: {
    jwt: {
      issuer: 'localhost',
      secret: process.env.AUTH_JWT_SECRET,
      algorithm: 'HS256',
      cookieDomain: process.env.COOKIE_DOMAIN,
      refreshToken: {
        expires: 7 * 24 * 60 * 60 * 1000, // 1 week
      },
      accessToken: {
        expires: 60 * 60 * 1000, // 1 hour
      },
    },
  },
})
