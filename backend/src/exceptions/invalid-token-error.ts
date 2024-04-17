import { BaseError } from './base-error'
import { ErrorsType } from './errors-type'

export class InvalidTokenError extends BaseError {
  constructor(details?: string | undefined, cause?: unknown) {
    super(ErrorsType.INVALID_TOKEN, `Invalid token`, details, cause)
  }
}
