import { ErrorsType } from '../../exceptions/errors-type'
import { z } from 'zod'


export const ErrorResponse = z.object({
  code: z.nativeEnum(ErrorsType),
  message: z.string(),
  cause: z.object({})
})

export type ErrorResponse = z.infer<typeof ErrorResponse>
