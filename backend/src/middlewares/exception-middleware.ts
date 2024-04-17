import { OutgoingHttpHeaders } from 'http'

import { Request, Response, NextFunction } from 'express'

import { BaseError, BaseErrorMetadata } from '../exceptions/base-error'
import { ErrorsType } from '../exceptions/errors-type'
import { NotFoundError } from '../exceptions/not-found-error'
import { ValidationError } from '../exceptions/validation-error'
import { InvalidTokenError } from '../exceptions/invalid-token-error'

export const exceptionMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line
  next: NextFunction
) => {
  if (error instanceof InvalidTokenError) {
    generateResponse(error.code, error.message, error.details, request, response.status(401), error.cause)
    return
  }

  if (error instanceof NotFoundError) {
    generateResponse(error.code, error.message, error.details, request, response.status(404))
    return
  }

  if (error instanceof ValidationError) {
    generateResponse(error.code, error.message, error.details, request, response.status(400), error.cause)
  }
  if (error instanceof BaseError) {
    generateResponse(
      error.code || ErrorsType.UNKNOWN_ERROR,
      error.message,
      error.details,
      request,
      response.status(error.status || 500),
      error.cause
    )
    return
  }

  generateResponse(ErrorsType.UNKNOWN_ERROR, error.message, undefined, request, response.status(500))
}

interface ExceptionRestLog extends BaseErrorMetadata {
  headers: OutgoingHttpHeaders
  method: string
  request: string
  httpCode: number
}

const generateResponse = (
  code: ErrorsType,
  message: string,
  details: string | undefined,
  request: Request,
  response: Response,
  cause: unknown = {}
): Response => {
  return response.json({ code, message, details, cause })
}