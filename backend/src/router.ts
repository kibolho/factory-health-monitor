import path from 'path'

import Express, { Request, Response } from 'express'

import { findRouters } from './utils/find-routes'
import { makeDocsRouters } from './docs/docs-routers'

export const makeRouters = async (app: Express.Application): Promise<void> => {
  const modulePath = path.join(__dirname, './modules')

  const routers = await findRouters(modulePath)

  for (const router of routers) {
    app.use('/', router)
  }

  await makeDocsRouters(app)

  app.get('*', function (request: Request, response: Response) {
    response.sendStatus(404)
  })
}
