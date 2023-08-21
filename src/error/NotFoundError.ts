import { CustomError } from 'ts-custom-error'

export default class NotFoundError extends CustomError {
  public constructor(message?: string) {
    super(message)
  }
}
