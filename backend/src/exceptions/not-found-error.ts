import { BaseError } from './base-error'
import { ErrorsType } from './errors-type'

export class NotFoundError extends BaseError {
  constructor(details?: string | undefined, cause?: object) {
    super(ErrorsType.NOT_FOUND, 'Item not found', details, cause)
  }
}
