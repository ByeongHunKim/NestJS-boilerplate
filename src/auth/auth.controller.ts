import { Request, Response } from 'express'
import {
  Controller,
  HttpCode,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '@/src/auth/auth.service'
import { PublicApi } from '@/src/auth/rbac/publicApi.decorator'
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { AuthenticatedUser } from '@/src/auth/user.decorator'
import { ConfigService } from '@nestjs/config'
import {
  GoogleAuthGuard,
  KakaoAuthGuard,
} from '@/src/auth/auth.guard.decorator'

@Controller('auth')
@ApiTags('authentication')
@PublicApi()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('/token')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'client 가 cookie 에 정상적인 refresh token 을 보유하고 있을시에 동작합니다',
  })
  async refreshToken(@Req() req, @Res() res) {
    await this.authService.verifyAndRenewAccessToken(req, res)
    res.send()
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Google login', description: '구글 로그인' })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleLogin(): void {}

  @Get('/google/redirect')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  async googleLoginRedirect(
    @AuthenticatedUser() user,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    await this.authService.socialLoginOrSignUp(user, res)

    const redirectTo = this.configService.get<string>(
      'auth.redirectEndpointAfterSocialLogin',
    )
    res.redirect(302, redirectTo)
  }

  @Get('/kakao')
  @UseGuards(KakaoAuthGuard)
  @ApiOperation({ summary: 'Kakao login', description: '카카오 로그인' })
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  kakaoLogin(): void {}

  @Get('/kakao/redirect')
  @UseGuards(KakaoAuthGuard)
  @ApiExcludeEndpoint()
  async kakaoLoginRedirect(
    @AuthenticatedUser() user,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    await this.authService.socialLoginOrSignUp(user, res)

    const redirectTo = this.configService.get<string>(
      'auth.redirectEndpointAfterSocialLogin',
    )
    res.redirect(302, redirectTo)
  }

  @HttpCode(200)
  @Post('/login')
  @ApiOperation({
    summary: 'Local login',
    description:
      'id, password 로 로그인을 하며, password 가 맞을 시 로그인 됩니다',
  })
  @UseGuards(AuthGuard('local'))
  @ApiBody({
    schema: {
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async localLogin(
    @AuthenticatedUser() user,
    @Res({ passthrough: true }) res,
  ): Promise<void> {
    await this.authService.localLogin(user, res)
  }

  @HttpCode(200)
  @Post('/logout')
  @ApiOperation({
    summary: 'Local logout',
    description: '로그아웃',
  })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(req, res)
  }
}
