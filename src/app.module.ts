import { Module } from '@nestjs/common'
import { AuthModule } from '@/src/auth/auth.module'
import config from '@/config'
import { ConfigModule } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { RolesGuard } from '@/src/auth/rbac/roles.guard'
import { LoggerModule } from '@/src/logger.module'
import { HealthModule } from '@/src/health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'], // todo using loadEnvFilePath() for handling many environment
      load: [config],
      isGlobal: true,
    }),
    HealthModule,
    LoggerModule,
    AuthModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
