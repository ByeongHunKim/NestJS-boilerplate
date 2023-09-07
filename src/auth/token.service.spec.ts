import { Test, TestingModule } from '@nestjs/testing'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'
import { AccessTokenPayload, TokenService, TokenType } from './token.service'
import { testUser } from '../../test/fixtures/user.fixture'

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

  describe('#issueToken', () => {
    it('issue token should return jwt token', async () => {
      const refreshToken = await tokenService.issueToken(
        TokenType.REFRESH,
        user,
      )
      expect(refreshToken.length > 0).toBeTruthy()

      const accessToken = await tokenService.issueToken(TokenType.ACCESS, user)
      expect(accessToken.length > 0).toBeTruthy()
    })

    const expectedRefreshTokenPayloadKeys = ['iat', 'exp', 'iss', 'sub']
    it(`refresh token should have only ${expectedRefreshTokenPayloadKeys.join(
      ', ',
    )} ${expectedRefreshTokenPayloadKeys.length} payload`, async () => {
      const refreshToken = await tokenService.issueToken(
        TokenType.REFRESH,
        user,
      )
      const payload = jwtService.decode(refreshToken)
      expect(Object.keys(payload!)).toHaveLength(
        expectedRefreshTokenPayloadKeys.length,
      )
      expectedRefreshTokenPayloadKeys.forEach((payloadKey) => {
        expect(payload![payloadKey]).toBeDefined()
      })
    })

    const expectedAccessTokenPayloadKeys = ['iat', 'exp', 'iss', 'sub', 'role']
    it('access token has a role when issue token', async () => {
      const accessToken = await tokenService.issueToken(TokenType.ACCESS, user)
      const payload = jwtService.decode(accessToken)
      expect(Object.keys(payload!)).toHaveLength(
        expectedAccessTokenPayloadKeys.length,
      )
      expectedAccessTokenPayloadKeys.forEach((payloadKey) => {
        expect(payload![payloadKey]).toBeDefined()
      })
    })
  })

  describe('#verifyToken', () => {
    it('should return token payload when token string is correct', async () => {
      const accessToken = await tokenService.issueToken(TokenType.ACCESS, user)
      const payload = await tokenService.verifyToken<AccessTokenPayload>(
        accessToken,
      )
      expect(payload).toBeDefined()
    })

    it('should throw error when token string is incorrect', async () => {
      const notIncorrectToken = 'not.incorrect'
      await expect(
        tokenService.verifyToken<AccessTokenPayload>(notIncorrectToken),
      ).rejects.toThrowError()
    })

    it('should throw issuer', async () => {
      const accessToken = await tokenService.issueToken(
        TokenType.ACCESS,
        user,
        {
          issuer: 'not.test',
        },
      )
      await expect(
        tokenService.verifyToken<AccessTokenPayload>(accessToken),
      ).rejects.toThrowError()
    })
  })
})
