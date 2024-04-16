import path from 'path'

import app from '../../package.json'

export interface RoutesMap {
  [platform: string]: {
    [version: string]: { path: string; route: string }[]
  }
}
export class DocVersionContainer {
  static docs: RoutesMap = {}

  static register(
    platforms: ('web' | 'mobile')[] = ['mobile', 'web'],
    version: string = app.version
  ) {
    return function (target: any): any {
      if (!target.filePath) throw new Error('Invalid filePath')

      const filePath = path.relative(process.cwd(), target.filePath).replace(/\.ts|\.js$|^dist\//, '')
      const fileName = target.filePath.replace(/^.*[\\/]/, '')

      const match = fileName.match(/.routes.(ts|js)$/)
      if (!match) {
        throw new Error('Invalid routes file name')
      }
      const route = fileName.replace(/-routes|-v\d+\.\d+\.\d+|\.ts/, '')
      platforms.forEach((platform) => {
        const oldData = DocVersionContainer.docs[platform]?.[version] ?? []
        const newData = [
          ...oldData,
          {
            path: filePath,
            route
          }
        ]

        DocVersionContainer.docs = {
          ...DocVersionContainer.docs,
          [platform]: {
            ...(DocVersionContainer.docs[platform] ?? {}),
            [version]: newData
          }
        }
      })

      target.version = version

      return target
    }
  }
}
