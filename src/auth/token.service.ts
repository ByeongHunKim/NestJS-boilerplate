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

interface IssueTokenOption {
  now?: number
  issuer?: string
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
    overrideOption?: IssueTokenOption,
  ): Promise<string> {
    invariant(!!user, 'User should not be empty')
    const tokenOption = this.tokenOptions[tokenType]
    const nowSeconds = overrideOption?.now ?? moment().second()
    const expiresIn = nowSeconds + tokenOption.expireSeconds
    const payload = this.getPayload(tokenType, user)

    return this.jwtService.signAsync(payload, {
      issuer: overrideOption?.issuer ?? this.jwtIssuer,
      subject: String(user.id),
      expiresIn: expiresIn,
      secret: this.jwtSecret,
      algorithm: this.jwtAlgorithm,
    })
  }

  /**
   * @throws JsonWebTokenError when token is invalid
   *
   * 주의: JsonWebTokenError 는 JsonWebTokenError prototype 을 가지고 있지 않고,
   * Error prototype 을 가지고 있어, e instanceof JsonWebTokenError 로 검사하면 안된다.
   * e.name === 'JsonWebTokenError' 로 검사를 해야 한다
   */
  async verifyToken<T extends TokenPayload>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token, {
      issuer: this.jwtIssuer,
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
