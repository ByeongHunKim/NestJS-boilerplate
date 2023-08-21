import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { AuthService } from '@/src/auth/auth.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.authService.validateUser(req)
    if (user) {
      req.user = user
    }
    next()
  }
}
