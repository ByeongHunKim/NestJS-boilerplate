import { Response } from 'express'
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common'
import ApplicationError from '@/src/error/ApplicationError'
import { CustomLogger } from '@/src/logger.service'

const logger = new CustomLogger('AppExceptionFilter')

@Catch(HttpException, ApplicationError)
export class AppExceptionFilter implements ExceptionFilter {
  catch(error: HttpException | ApplicationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : error.httpStatusCode ?? 500

    const errorCode = (error as ApplicationError).errorCode ?? ''

    logger.error(
      `${status} ${request.method} ${request.url} : ${JSON.stringify(error)}\n${
        error.stack
      }`,
    )

    // when auth error, hide message for security
    const message =
      error instanceof UnauthorizedException ? 'Unauthorized' : error.message

    response.status(status).json({
      errorCode,
      message,
    })
  }
}
