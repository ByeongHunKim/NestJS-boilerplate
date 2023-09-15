import { CustomError } from 'ts-custom-error'

export interface ApplicationErrorParams {
  message: string
  errorCode: string
  httpStatusCode?: number
}

export default class ApplicationError extends CustomError {
  errorCode: string
  httpStatusCode?: number

  public constructor({
    message,
    errorCode,
    httpStatusCode,
  }: ApplicationErrorParams) {
    super(message)

    this.errorCode = errorCode
    this.httpStatusCode = httpStatusCode
  }
}
