import { CustomError } from 'ts-custom-error'

export default class ConflictError extends CustomError {
  public constructor(message?: string) {
    super(message)
  }
}
