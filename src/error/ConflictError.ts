import ApplicationError, {
  ApplicationErrorParams,
} from '@/src/error/ApplicationError'

export default class ConflictError extends ApplicationError {
  public constructor(params: Omit<ApplicationErrorParams, 'errorCode'>) {
    super({ httpStatusCode: 409, ...params, errorCode: 'B1200' })
  }
}
