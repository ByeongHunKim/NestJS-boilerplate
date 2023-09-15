import {
  Controller,
  Get,
  Query,
  Param,
  NotFoundException,
  Post,
  Body,
} from '@nestjs/common'
import { UserService } from '@/src/user/user.service'
import { UserDto } from '@/src/user/dto/user.dto'
import { UserRole } from '@prisma/client'
import { ApiQuery, ApiTags, ApiBody, ApiOperation } from '@nestjs/swagger'
import { Roles } from '@/src/auth/rbac/roles.decorator'
import NotFoundError from '@/src/error/NotFoundError'
import { CreateUserDto } from '@/src/user/dto/user.create.dto'
import { PublicApi } from '@/src/auth/rbac/publicApi.decorator'
import { NumberWithDefaultPipe } from '@/src/common/pipes/number-with-default-pipe.service'
import { UserMapper } from '@/src/user/user.mapper'

@Controller('api/v1/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiTags('admin')
  @ApiQuery({
    name: 'offset',
  })
  @ApiQuery({
    name: 'limit',
  })
  @ApiOperation({
    summary: 'User info list',
    description: '전체 유저 정보를 가져옵니다',
  })
  async listUsers(
    @Query('offset', new NumberWithDefaultPipe(0)) offset,
    @Query('limit', new NumberWithDefaultPipe(6)) limit,
  ): Promise<UserDto[]> {
    return await this.userService.find(offset, limit)
  }

  @Get('/:userId')
  @Roles(UserRole.ADMIN)
  @ApiTags('admin')
  @ApiOperation({
    summary: 'User info',
    description: '특정 유저 정보를 가져옵니다',
  })
  async getUserById(@Param('userId') userId: number): Promise<UserDto> {
    try {
      const user = await this.userService.validateUserExists(userId)
      return this.userMapper.mapUserToUserDto(user)
    } catch (e) {
      if (e instanceof NotFoundError) {
        // todo error handling
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
  @ApiOperation({
    summary: 'Local signup',
    description: '일반 유저 회원가입에 쓰입니다',
  })
  async createUser(@Body() createDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userService.createLocalUser(createDto)
    return this.userMapper.mapUserToUserDto(user)
  }
}
