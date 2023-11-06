import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport'

export class GoogleAuthGuard extends AuthGuard('google') {
  getAuthenticateOptions(): IAuthModuleOptions<any> | undefined {
    return {
      prompt: 'select_account',
    }
  }
}

export class KakaoAuthGuard extends AuthGuard('kakao') {
  getAuthenticateOptions(): IAuthModuleOptions<any> | undefined {
    return {
      prompt: 'login',
    }
  }
}
