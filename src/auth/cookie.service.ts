import { CookieOptions, Request, Response } from 'express'
import { Injectable } from '@nestjs/common'
import { TokenType } from '@/src/auth/token.service'
import { ConfigService } from '@nestjs/config'

const cookieTokenKey = {
  [TokenType.REFRESH]: 'refreshToken',
  [TokenType.ACCESS]: 'accessToken',
}

@Injectable()
export class CookieService {
  private readonly cookieDomain: string
  private readonly cookieOptions: { [type in TokenType]: CookieOptions }

  constructor(private configService: ConfigService) {
    this.cookieDomain = configService.getOrThrow<string>(
      'auth.jwt.cookieDomain',
    )
    this.cookieOptions = {
      [TokenType.REFRESH]: {
        httpOnly: true,
        path: '/auth',
        domain: this.cookieDomain,
        maxAge: configService.get<number>('auth.jwt.refreshToken.expires'),
      },
      [TokenType.ACCESS]: {
        httpOnly: true,
        path: '/',
        domain: this.cookieDomain,
        maxAge: configService.get<number>('auth.jwt.accessToken.expires'),
      },
    }
  }

  getToken(req: Request, tokenType: TokenType): string | null {
    const key = cookieTokenKey[tokenType]
    const token = req && req.cookies && req.cookies[key]
    if (!token) {
      return null
    }
    return token
  }

  setCookie(res: Response, tokenType: TokenType, token: string): void {
    res.cookie(cookieTokenKey[tokenType], token, this.cookieOptions[tokenType])
  }

  clearCookie(res: Response, tokenType: TokenType): void {
    const { path, domain } = this.cookieOptions[tokenType]
    res.clearCookie(cookieTokenKey[tokenType], {
      path,
      domain,
    })
  }
}
