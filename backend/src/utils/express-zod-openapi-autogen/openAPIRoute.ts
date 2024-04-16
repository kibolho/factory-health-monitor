/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ZodError, ZodSchema, ZodTypeAny, z } from 'zod'

import { ErrorResponse } from './schemas'
import { VersionQuerySchema } from '../../middlewares/version-middleware'
import { ValidationError } from '../../exceptions/validation-error'

type ValidatedMiddleware<ZBody, ZQuery, ZParams, ZResponse> = (
  req: Request<ZParams, any, ZBody, ZQuery>,
  res: Response<ZResponse | { error: string } | z.infer<typeof ErrorResponse>>,
  next: NextFunction
) => any

type TBodyContent<T = ZodTypeAny> = {
  description: string
  type: 'application/json',
  schema: T,
  required?: boolean,
  examples?: any
}

type SchemaDefinition<
  TBody extends TBodyContent,
  TQuery extends ZodTypeAny,
  TParams extends ZodTypeAny,
  THeaders extends ZodTypeAny,
  TResponse extends ZodTypeAny
> = {
  /** The category this route should be displayed in within the OpenAPI documentation. */
  tag: string
  /** A short one-line description of the route */
  summary: string
  /** A long-form explanation of the route  */
  description?: string
  /** A string key identifying the type of authorization used on this route.
   * Should match one of the security types declared when the OpenAPI documentation
   * is built. */
  security?: string
  /** The zod schema defining the POST body of the request. */
  body?: TBody
  /** The zod schema defining the query string of the request. Use .optional() for optional
   * query params. Declare the entire object .strict() to fail if extra parameters are
   * passed, or .strip() to quietly remove them.
   */
  query?: TQuery
  /** The zod schema defining the route params (eg: /users/:id). Note that these are always
   * string values. Defining them mostly just provides better typescript types on req.params.
   */
  params?: TParams
  defaultParams?: ZodTypeAny | null
  /** The zod schema defining the headers params. Defining them mostly just provides better typescript types on req.headers.
   */
  headers?: THeaders
  /** The zod schema of the successful API response. In development mode, passing data that
   * does not match this type will yield a console warning.
   */
  response?: TResponse
  /** The content-type of the response, if it is not JSON. Typically this is passed
   * instead of a response schema for responses that are text/csv, application/pdf, etc.
   */
  responseContentType?: string
  /** Mark the route as deprecated in generated OpenAPI docs. Does not have any impact on routing. */
  deprecated?: boolean
}

const check = <TType>(obj?: any, schema?: ZodSchema<TType>): z.SafeParseReturnType<TType, TType> => {
  if (!schema) {
    return { success: true, data: obj }
  }
  const r = schema.safeParse(obj)
  return r
}

type ValidatedRequestHandler = RequestHandler & {
  validateSchema: SchemaDefinition<any, any, any, any, any>
}

export const getSchemaOfOpenAPIRoute = (
  fn: RequestHandler | ValidatedRequestHandler | ValidatedRequestHandler[]
) => {
  if (Array.isArray(fn)) {
    return fn.find((f) => 'validateSchema' in f)?.validateSchema
  }
  return 'validateSchema' in fn ? (fn.validateSchema as SchemaDefinition<any, any, any, any, any>) : null
}

const getErrorSummary = (error: ZodError<unknown>) => {
  return error.issues.map((i) => (i.path.length ? `${i.path.join('.')}: ${i.message}` : i.message)).join(', ')
}
/**
 * Note: This function wraps the route handler rather than just being a chained piece
 * of middleware so that we can validate the response shape as well as the request shape.
 */
export const openAPIRoute = <
  TBodySchema extends ZodTypeAny,
  TQuery extends ZodTypeAny,
  TParams extends ZodTypeAny,
  THeaders extends ZodTypeAny,
  TResponse extends ZodTypeAny
>(
  {
    defaultParams = VersionQuerySchema,
    ...schema
  }: SchemaDefinition<{ schema: TBodySchema } & Omit<TBodyContent, 'schema'>, TQuery, TParams, THeaders, TResponse>,
  middleware: ValidatedMiddleware<z.infer<TBodySchema>, z.infer<TQuery>, z.infer<TParams>, z.infer<TResponse>>
): RequestHandler => {
  const openAPISchema = {
    ...schema,
    // @ts-ignore
    query: schema.query ? schema.query.merge(defaultParams) : defaultParams ?? undefined
  }
  const fn: ValidatedRequestHandler = async (req, res, next) => {
    try {
      const bodyResult = check(req.body, openAPISchema.body?.schema)
      const queryResult = check(req.query, openAPISchema.query)
      const paramResult = check(req.params, openAPISchema.params)
      const headersResult = check(req.headers, openAPISchema.headers)

      if (bodyResult.success && queryResult.success && paramResult.success && headersResult.success) {
        // Patch the `res.json` method we pass into the handler so that we can validate the response
        // body and warn if it doesn't match the provided response schema.
        const _json = res.json
        res.json = (body: unknown) => {
          // In dev + test, validate that the JSON response from the endpoint matches
          // the Zod schemas. In production, we skip this because it's just time consuming
          if (process.env.NODE_ENV !== 'production') {
            const acceptable = z.union([openAPISchema.response as ZodTypeAny, ErrorResponse])
            const result = openAPISchema.response ? acceptable.safeParse(body) : { success: true }

            if (result.success === false && 'error' in result) {
              console.warn(
                `Note: Response JSON does not match schema:\n${getErrorSummary(result.error)}\n${JSON.stringify(result.error.errors)}`
              )
            }
          }
          return _json.apply(res, [body])
        }

        Object.defineProperty(req, 'query', { value: queryResult.data })
        Object.defineProperty(req, 'body', { value: bodyResult.data })
        Object.defineProperty(req, 'params', { value: paramResult.data })
        Object.defineProperty(req, 'headers', { value: headersResult.data })
        return await middleware(req as unknown as Request<TParams, any, TBodySchema, TQuery>, res, next)
      }

      if (!bodyResult.success) {
        throw new ValidationError('Invalid body', 'check docs', bodyResult.error.errors)
      }

      if (!queryResult.success) {
        throw new ValidationError('Invalid query params', 'check docs', queryResult.error.errors)
      }

      if (!paramResult.success) {
        throw new ValidationError('Invalid route params', 'check docs', paramResult.error.errors)
      }

      if (!headersResult.success) {
        throw new ValidationError('Invalid headers', 'check docs', headersResult.error.errors)
      }

      return next(new Error('zod-express-guard could not validate this request'))
    } catch (err) {
      return next(err)
    }
  }
  fn.validateSchema = openAPISchema
  return fn
}
