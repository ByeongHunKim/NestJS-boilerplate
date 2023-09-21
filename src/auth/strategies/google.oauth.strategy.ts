import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'
import { ConfigService } from '@nestjs/config'
import { SocialType } from '@prisma/client'
import { SimpleSocialUserCreateDto } from '@/src/user/dto/user.create.dto'

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('auth.google.clientId'),
      clientSecret: configService.get<string>('auth.google.clientSecret'),
      callbackURL:
        configService.get<string>('serverBaseUrl') + 'auth/google/redirect',
      scope: ['email'],
    })
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { id, emails } = profile

    const user = SimpleSocialUserCreateDto.fromSocialLoginRequest({
      email: emails[0].value,
      socialId: id,
      socialType: SocialType.GOOGLE,
    })

    done(null, user)
  }
}
