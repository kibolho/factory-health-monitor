import Express, { Request, Response } from 'express'
import { z } from 'zod'

import { DocVersionContainer } from '../../docs/doc-version-container'
import { openAPIRoute } from '../../utils/express-zod-openapi-autogen/openAPIRoute'

@DocVersionContainer.register(undefined, '1.0.0')
export class MakeRouters {
  static version: string | undefined
  static filePath = __filename

  register(router: Express.Router): void {
    router.get(
      '/healthcheck',
      openAPIRoute(
        {
          tag: 'Health Check',
          summary: 'Endpoint to check if the server is running',
          response: z.object({
            datetime: z
              .string()
              .openapi({ example: '2024-02-21T12:34:26.737Z', description: 'Server datetime' }),
            ok: z.boolean()
          }),
          defaultParams: null
        },
        (request: Request, response: Response) => {
          response.status(200).send({ datetime: new Date().toISOString(), ok: true })
        }
      )
    )
  }
}