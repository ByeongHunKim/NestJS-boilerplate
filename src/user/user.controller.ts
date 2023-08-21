import { Controller, Get, Query } from '@nestjs/common'
import { UserService } from '@/src/user/user.service'
import { UserDto } from '@/src/user/dto/user.dto'
import { UserRole } from '@prisma/client'
import { ApiQuery, ApiTags } from '@nestjs/swagger'
import { Roles } from '@/src/auth/rbac/roles.decorator'

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiTags('admin')
  @ApiQuery({
    name: 'offset',
  })
  @ApiQuery({
    name: 'limit',
  })
  async listUsers(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<UserDto[]> {
    return await this.userService.find(offset, limit)
  }
}
