import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'
import { PublicApi } from '@/src/auth/rbac/publicApi.decorator'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@Controller('health')
export class HealthController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @PublicApi()
  @Get()
  @HealthCheck()
  @ApiTags('health')
  @ApiOperation({
    summary: 'Health check',
    description: '서버 헬스 체크를 위해 동작합니다',
  })
  health() {
    return this.healthCheckService.check([])
  }
}
