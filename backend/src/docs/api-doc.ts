import { isDev } from '../utils/env'
import { OpenAPIConfig } from 'utils/express-zod-openapi-autogen/openAPI'

export const getApiDoc = ({ version = '1.0.0' }: { version?: string }): OpenAPIConfig => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'Factory Health Monitor',
      description: 'Documentation for the Factory Health Monitor API',
      version
    },
    servers: [
      ...(isDev()
        ? [
            {
              url: 'http://localhost:8000',
              description: 'Local server'
            }
          ]
        : []),
    ],
    components: {
      securitySchemes: {
        bearer_auth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  }
}
