import { ApiProperty } from '@nestjs/swagger'
import { User, LoginType, SocialType } from '@prisma/client'

type SimpleCommonUserCreateDto = Pick<User, 'email' | 'loginType'>
type SimpleSocialUserCreateDtoType = SimpleCommonUserCreateDto &
  Pick<User, 'socialId' | 'socialType'>

interface SimpleSocialUserCreateDtoProps {
  email: string
  loginType: LoginType
  socialId: string
  socialType: SocialType
}

export class SimpleSocialUserCreateDto
  implements SimpleSocialUserCreateDtoType
{
  email: string
  loginType: LoginType
  socialId: string
  socialType: SocialType

  constructor(props: SimpleSocialUserCreateDtoProps) {
    this.email = props.email
    this.loginType = props.loginType
    this.socialId = props.socialId
    this.socialType = props.socialType
  }

  static fromSocialLoginRequest(request: {
    email: string
    socialId: string
    socialType: SocialType
  }) {
    return new SimpleSocialUserCreateDto({
      email: request.email,
      loginType: LoginType.SOCIAL,
      socialId: request.socialId,
      socialType: request.socialType,
    })
  }
}

export type SimpleLocalUserCreateDto = SimpleCommonUserCreateDto &
  Pick<User, 'username' | 'password'>
export type SimpleUserCreateDto =
  | SimpleSocialUserCreateDto
  | SimpleLocalUserCreateDto

export type RequiredUserCreateDto = Required<Pick<User, 'nickName' | 'role'>>
export type SocialUserCreateDto = SimpleSocialUserCreateDto &
  RequiredUserCreateDto
export type LocalUserCreateDto = SimpleLocalUserCreateDto &
  RequiredUserCreateDto

export type UserCreateDto = LocalUserCreateDto | SocialUserCreateDto

export class CreateUserDto {
  @ApiProperty()
  email: string

  @ApiProperty({ default: 'LOCAL' })
  loginType: LoginType

  @ApiProperty()
  username: string

  @ApiProperty()
  password: string
}
