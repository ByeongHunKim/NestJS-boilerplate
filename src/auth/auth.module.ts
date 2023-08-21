import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { UserModule } from '@/src/user/user.module'
import { UserService } from '@/src/user/user.service'
import { JwtModule } from '@nestjs/jwt'
import { PrismaProvider } from '@/src/common/prisma/prisma.provider'
import { LocalStrategy } from '@/src/auth/strategies/local.strategy'
import { AuthMiddleware } from '@/src/auth/auth.middleware'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/src/auth/auth.guard'
import { TokenService } from '@/src/auth/token.service'
import { CookieService } from '@/src/auth/cookie.service'

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    PrismaProvider,
    LocalStrategy,
    AuthService,
    UserService,
    TokenService,
    CookieService,
  ],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/(.*)').forRoutes('*')
  }
}
