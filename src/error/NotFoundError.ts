import ApplicationError, {
  ApplicationErrorParams,
} from '@/src/error/ApplicationError'

export default class NotFoundError extends ApplicationError {
  public constructor(params: Omit<ApplicationErrorParams, 'errorCode'>) {
    super({ httpStatusCode: 404, ...params, errorCode: 'B1300' })
  }
}
