import fs from 'fs/promises'
import path from 'path'

import Express from 'express'

export const findRouters = async (dirPath: string): Promise<Express.Router[]> => {
  const files = await fs.readdir(dirPath)
  const routers: Express.Router[] = []

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const stats = await fs.stat(filePath)
    if (stats.isDirectory()) {
      const subRouters = await findRouters(filePath)
      routers.push(...subRouters)
    } else if (!['.spec.', '.map'].some((ext) => file.includes(ext)) && file.includes('routes')) {
      const { MakeRouters } = await import(filePath)
      const router = Express.Router();
      new MakeRouters().register(router)
      if (router) routers.push(router)
    }
  }

  return routers
}
