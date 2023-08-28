import { Test, TestingModule } from '@nestjs/testing'
import {
  AccessTokenPayload,
  TokenService,
  TokenType,
} from '@/src/auth/token.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { testUser } from '@/test/fixtures/user.fixture'

describe('TokenService', () => {
  let jwtService: JwtService
  let tokenService: TokenService
  let user: User

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        JwtService,
        TokenService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn((key: string) => {
              switch (key) {
                case 'auth.jwt.issuer':
                  return 'test'
                case 'auth.jwt.secret':
                  return 'test'
                case 'auth.jwt.algorithm':
                  return 'HS256'
                case 'auth.jwt.refreshToken.expires':
                  return 3 * 1000
                default:
                  return null
              }
            }),
          },
        },
      ],
    }).compile()

    jwtService = module.get<JwtService>(JwtService)
    tokenService = module.get<TokenService>(TokenService)
    user = { ...testUser }
  })

  it('should be defined', () => {
    expect(tokenService).toBeDefined()
  })
})
