import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { PublicApi } from '@/src/auth/rbac/publicApi.decorator'
import { ApiTags } from '@nestjs/swagger'

@Controller('health')
export class HealthController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @PublicApi()
  @Get()
  @HealthCheck()
  @ApiTags('health')
  health() {
    return this.healthCheckService.check([])
  }
}
