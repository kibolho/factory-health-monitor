import Express, { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'


import { convertSemanticVersionToNumber } from '../utils/convert-semantic-version-to-number'
import { buildOpenAPIDocument } from '../utils/express-zod-openapi-autogen/openAPI'
import { getApiDoc } from './api-doc'
import { DocVersionContainer, RoutesMap } from './doc-version-container'

function fallbackPreviousVersions(routes: RoutesMap) {
  return Object.entries(routes).reduce((acc, [currentPlatform, routes]) => {
    const versions = Object.keys(routes).sort((a, b) => {
      const aVersion = convertSemanticVersionToNumber(a)
      const bVersion = convertSemanticVersionToNumber(b)
      if (aVersion && bVersion) {
        return aVersion - bVersion
      }
      return 0
    })
    for (let i = 1; i < versions.length; i++) {
      const prevRoutes = routes[versions[i - 1]]
      const currRoutes = routes[versions[i]]

      const prevRoutesSet = new Set(prevRoutes.map((r) => r.route))

      currRoutes.forEach((route) => {
        if (!prevRoutesSet.has(route.route)) {
          prevRoutes.push(route)
        }
      })
      routes[versions[i - 1]] = prevRoutes
    }
    return { ...acc, [currentPlatform]: routes }
  }, {} as RoutesMap)
}

export const makeDocsRouters = async (app: Express.Application): Promise<void> => {
  const docsUrls: { url: string; name: string }[] = []

  await Promise.all(
    Object.entries(fallbackPreviousVersions(DocVersionContainer.docs)).map(
      async ([platform, versionsObject]) => {
        return Promise.all(
          Object.entries(versionsObject).map(async ([version, versionData]) => {
            const routers = await Promise.all(
              versionData.map(async (d) => {
                  const { MakeRouters } = await import(`../../${d.path}`)
                  const router = Express.Router();
                  new MakeRouters().register(router)
                  return router
              })
            )
                  
            const openApiSpecification = buildOpenAPIDocument({
              routers,
              schemaPaths: [],
              config: getApiDoc({ version }),
              errors: { 401: 'Unauthorized', 403: 'Forbidden' }
            })
            const docsUrl = `/docs/${platform}/api-docs-${version}.json`
            docsUrls.push({ url: docsUrl, name: `${platform} - ${version}` })
            app.get(docsUrl, (request: Request, response: Response) => {
              response.setHeader('Content-Type', 'application/json')
              response.json(openApiSpecification)
            })
            return Promise.resolve()
          })
        )
      }
    )
  )
  const options = {
    explorer: true,
    swaggerOptions: {
      urls: docsUrls
    }
  }
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(undefined, options))
}
