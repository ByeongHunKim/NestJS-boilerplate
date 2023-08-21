import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Post,
  Body,
  ConflictException,
} from '@nestjs/common'
import { UserService } from '@/src/user/user.service'
import { UserDto } from '@/src/user/dto/user.dto'
import { UserRole } from '@prisma/client'
import { ApiQuery, ApiTags, ApiBody } from '@nestjs/swagger'
import { Roles } from '@/src/auth/rbac/roles.decorator'
import NotFoundError from '@/src/error/NotFoundError'
import { CreateUserDto } from '@/src/user/dto/user.create.dto'
import { PublicApi } from '@/src/auth/rbac/publicApi.decorator'
import ConflictError from '@/src/error/ConflictError'

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

  @Get('/:userId')
  @Roles(UserRole.ADMIN)
  @ApiTags('admin')
  async getUserById(@Param('userId') userId: number): Promise<UserDto> {
    try {
      const user = await this.userService.validateUserExists(userId)
      return this.userService.mapUserToUserDto(user)
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException(e.message)
      }
      throw e
    }
  }

  @Post()
  @ApiTags('public')
  @PublicApi()
  @ApiBody({
    type: CreateUserDto,
  })
  async createUser(@Body() createDto: CreateUserDto): Promise<UserDto> {
    try {
      const user = await this.userService.createLocalUser(createDto)
      return this.userService.mapUserToUserDto(user)
    } catch (e) {
      if (e instanceof ConflictError) {
        throw new ConflictException(e.message)
      }
      throw e
    }
  }
}
