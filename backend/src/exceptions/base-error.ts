import { ErrorsType } from './errors-type'

export interface BaseErrorMetadata {
  code: ErrorsType
  message: string
  details?: string
  cause?: unknown
}

export class BaseError extends Error implements BaseErrorMetadata {
  public constructor(
    public code: ErrorsType,
    message?: string,
    public details?: string,
    public cause?: unknown,
  ) {
    super(message)
  }
}
