import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'


import { ValidationError } from '../exceptions/validation-error'
import { convertSemanticVersionToNumber } from '../utils/convert-semantic-version-to-number'

export const VersionQuerySchema = z.object({
  version: z
    .string()
    .refine(
      (value) => {
        const parts = value.split('.')
        return (
          parts.length === 3 &&
          !isNaN(Number(parts[0])) &&
          !isNaN(Number(parts[1])) &&
          !isNaN(Number(parts[2]))
        )
      },
      {
        message: 'Must be a valid semantic version string in x.x.x format'
      }
    )
    .transform((value) => convertSemanticVersionToNumber(value))
})

export const MiddlewareVersion = (version?: string) => {
  return function (req: Request, _: Response, next: NextFunction) {
    const response = VersionQuerySchema.safeParse(req?.query)
    if (!response.success)
      throw new ValidationError('Invalid query params', 'version key is wrong', response?.error?.errors)
    const requestVersion = response.data.version
    const currentVersion = convertSemanticVersionToNumber(version)
    if (typeof requestVersion !== 'number' || typeof currentVersion !== 'number') {
      // Invalid API version requested
      throw new ValidationError('Invalid API Version', `${req?.query?.version}`)
    }
    if (requestVersion <= currentVersion) return next()
    // Skip to next route
    return next('route')
  }
}
