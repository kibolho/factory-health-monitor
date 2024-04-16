import { BaseError } from './base-error'
import { ErrorsType } from './errors-type'

export class ValidationError extends BaseError {
  constructor(message = 'Validation Error', detail = '', cause = {}) {
    super(ErrorsType.VALIDATION_ERROR, message, detail, cause)
  }
}
