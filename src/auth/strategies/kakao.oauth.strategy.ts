import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-kakao'
import { SocialType } from '@prisma/client'
import { SimpleSocialUserCreateDto } from '@/src/user/dto/user.create.dto'

class KaKaoStrategy extends Strategy {
  authorizationParams(options) {
    const params: {
      [key: string]: unknown
    } = {}
    params.prompt = options.prompt
    return params
  }
}

@Injectable()
export class KakaoOauthStrategy extends PassportStrategy(
  KaKaoStrategy,
  'kakao',
) {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.kakao.clientId'),
      clientSecret: configService.get<string>('auth.kakao.clientSecret'),
      callbackURL:
        configService.get<string>('serverBaseUrl') + '/auth/kakao/redirect',
      scope: ['account_email'],
    })
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void,
  ) {
    const {
      _json: {
        kakao_account: { email },
      },
      id,
    } = profile

    const user = SimpleSocialUserCreateDto.fromSocialLoginRequest({
      email: email,
      socialId: id.toString(),
      socialType: SocialType.KAKAO,
    })

    done(null, user)
  }
}
