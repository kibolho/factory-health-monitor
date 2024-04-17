import path from 'path'

import Express, { Request, Response } from 'express'

import { findRouters } from './utils/find-routes'
import { makeDocsRouters } from './docs/docs-routers'
import { exceptionMiddleware } from './middlewares/exception-middleware'

export const makeRouters = async (app: Express.Application): Promise<void> => {
  const modulePath = path.join(__dirname, './modules')

  const routers = await findRouters(modulePath)

  for (const router of routers) {
    app.use('/', router)
  }

  await makeDocsRouters(app)

  app.all('*', function (request: Request, response: Response) {
    response.sendStatus(404)
  })
  app.use(exceptionMiddleware)

}
