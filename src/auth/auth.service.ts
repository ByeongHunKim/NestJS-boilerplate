import moment from 'moment'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@/src/user/user.service'
import {
  LocalLoginRequestDto,
  SocialLoginRequestDto,
} from '@/src/auth/dto/login.request.dto'
import { Request, Response } from 'express'
import { User } from '@prisma/client'
import {
  RefreshTokenPayload,
  TokenService,
  TokenType,
} from '@/src/auth/token.service'
import { CookieService } from '@/src/auth/cookie.service'
import { UserRepository } from '@/src/user/user.repository'
import { SimpleSocialUserCreateDto } from '@/src/user/dto/user.create.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly cookieService: CookieService,
  ) {}

  async validateUser(req: Request): Promise<User | null> {
    const accessToken = this.cookieService.getToken(req, TokenType.ACCESS)
    if (!accessToken) {
      return null
    }
    const decoded = await this.tokenService.verifyToken(accessToken)
    const userId = Number(decoded.sub)
    return this.userService.findById(userId)
  }

  async socialLoginOrSignUp(
    loginRequest: SocialLoginRequestDto,
    res: Response,
  ): Promise<void> {
    let user = await this.userRepository.findByEmail(loginRequest.email)
    if (!user) {
      user = await this.userService.createSocialUser(
        loginRequest as SimpleSocialUserCreateDto,
      )
      await this.doLogin(user, res)
    }
  }

  async localLogin(
    loginRequest: LocalLoginRequestDto,
    res: Response,
  ): Promise<void> {
    const user = await this.userService.validateLocalUser(
      loginRequest.username,
      loginRequest.password,
    )
    await this.doLogin(user, res)
  }

  private async doLogin(user: User, res: Response): Promise<void> {
    const nowSeconds = moment().second()
    await this.renewRefreshToken(res, user, nowSeconds)
    await this.renewAccessToken(res, user, nowSeconds)
  }

  async verifyAndRenewAccessToken(req: Request, res: Response) {
    const refreshToken = this.cookieService.getToken(req, TokenType.REFRESH)
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token does not exist')
    }

    const decoded = await this.tokenService.verifyToken<RefreshTokenPayload>(
      refreshToken,
    )
    const userId = Number(decoded.sub)
    const user = await this.userService.findById(userId)

    if (!user) {
      throw new UnauthorizedException(`User id: ${userId} does not exist`)
    }

    if (user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Refresh token is not matched')
    }

    await this.renewAccessToken(res, user)
  }

  async logout(req: Request, res: Response) {
    const refreshToken = this.cookieService.getToken(req, TokenType.REFRESH)
    if (refreshToken) {
      let decoded

      try {
        decoded = await this.tokenService.verifyToken<RefreshTokenPayload>(
          refreshToken,
        )
      } catch (e) {
        if (e.name === 'JsonWebTokenError') {
          throw new UnauthorizedException(e.message)
        }
        throw e
      }

      const userId = Number(decoded.sub)
      const user = await this.userService.findById(userId)
      if (user && user.refreshToken === refreshToken) {
        await this.userService.updateRefreshToken(user.id, '')
      }
    }
    this.cookieService.clearCookie(res, TokenType.REFRESH)
    this.cookieService.clearCookie(res, TokenType.ACCESS)
  }

  private async renewRefreshToken(res: Response, user: User, now?: number) {
    const refreshToken = await this.tokenService.issueToken(
      TokenType.REFRESH,
      user,
      { now },
    )
    await this.userService.updateRefreshToken(user.id, refreshToken)
    this.cookieService.setCookie(res, TokenType.REFRESH, refreshToken)
  }

  private async renewAccessToken(res: Response, user: User, now?: number) {
    const accessToken = await this.tokenService.issueToken(
      TokenType.ACCESS,
      user,
      { now },
    )
    this.cookieService.setCookie(res, TokenType.ACCESS, accessToken)
  }
}
