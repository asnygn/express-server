import fs from 'fs'
import crypto from 'crypto'

import config from '@/config.js'

export function createFolder(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true })
  }
}

export function deleteFile(filePath: string) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Failed to delete file.')
    }
  })
}

export function saveFile(file: File, folderPath: string) {
  const fileExtension = file.originalFilename.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExtension}`
  const filePath = `/${folderPath}/${fileName}`
  const fullPath = `${config.basedir}${folderPath}/${fileName}`

  createFolder(folderPath)

  fs.rename(file.path, fullPath, function (err) {
    if (err) {
      console.error('Saving file failed.')
    }
  })
  return { fileName, filePath }
}

export function zodValidator(schema: any, payload: any) {
  try {
    schema.parse(payload)
  } catch (err: any) {
    const errors: { [key: string]: string } = {}
    for (const iterator of err.errors) {
      errors[iterator.path.join('.')] = iterator.message
    }
    return errors
  }
}

export function buildMongooseQuery(query: RequestQuery) {
  const filters = {}
  const options = {
    skip: query.skip ? query.skip : 0,
    limit: query.limit ? query.limit : 0,
  }
  return { filters, options }
}
