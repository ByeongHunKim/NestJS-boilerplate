import moment from 'moment'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User, UserRole } from '@prisma/client'
import invariant from 'tiny-invariant'
import { Algorithm } from 'jsonwebtoken'

export const TokenType = {
  REFRESH: 'REFRESH',
  ACCESS: 'ACCESS',
}
export type TokenType = (typeof TokenType)[keyof typeof TokenType]

export type AccessTokenPayload = {
  iat: number
  exp: number
  iss: string
  sub: string
  role: UserRole
}

export type RefreshTokenPayload = {
  iat: number
  exp: number
  iss: string
  sub: string
}

export type TokenPayload = AccessTokenPayload | RefreshTokenPayload

interface TokenOption {
  expireSeconds: number
}

@Injectable()
export class TokenService {
  private readonly jwtIssuer: string
  private readonly jwtSecret: string
  private readonly jwtAlgorithm: Algorithm
  private readonly tokenOptions: { [type in TokenType]: TokenOption }

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.jwtIssuer = configService.getOrThrow<string>('auth.jwt.issuer')
    this.jwtSecret = configService.getOrThrow<string>('auth.jwt.secret')
    this.jwtAlgorithm =
      configService.getOrThrow<Algorithm>('auth.jwt.algorithm')
    this.tokenOptions = {
      [TokenType.REFRESH]: {
        expireSeconds: configService.getOrThrow<number>(
          'auth.jwt.refreshToken.expires',
        ),
      },
      [TokenType.ACCESS]: {
        expireSeconds: configService.getOrThrow<number>(
          'auth.jwt.accessToken.expires',
        ),
      },
    }
  }

  async issueToken(
    tokenType: TokenType,
    user: User,
    now?: number,
  ): Promise<string> {
    invariant(!!user, 'User should not be empty')
    const option = this.tokenOptions[tokenType]
    const nowSeconds = now ?? moment().second()
    const expiresIn = nowSeconds + option.expireSeconds
    const payload = this.getPayload(tokenType, user)

    return this.jwtService.signAsync(payload, {
      issuer: this.jwtIssuer,
      subject: String(user.id),
      expiresIn: expiresIn,
      secret: this.jwtSecret,
      algorithm: this.jwtAlgorithm,
    })
  }

  async verifyToken<T extends TokenPayload>(token: string): Promise<T | null> {
    return this.jwtService.verifyAsync(token, {
      secret: this.jwtSecret,
    })
  }

  private getPayload(tokenType: TokenType, user: User): object {
    switch (tokenType) {
      case TokenType.REFRESH:
        return {}
      case TokenType.ACCESS:
        return { role: user.role }
      default:
        throw new Error(`Not supported tokenType: ${tokenType}`)
    }
  }
}
