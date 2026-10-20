import fs from 'node:fs'
import path from 'node:path'

export function parseFilenames(filenames) {
  if (typeof filenames !== 'string')
    throw new Error('Missing filenames environment variable')

  return filenames
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0)
}

export function assertSafeName(name) {
  if (path.isAbsolute(name) || name.includes('..'))
    throw new Error(`Refusing unsafe name: ${name}`)
}

export function resolveParentDirectory(target) {
  if (typeof target !== 'string' || target.length === 0)
    throw new Error('Missing target path')

  const stat = fs.lstatSync(target)
  return stat.isFile() ? path.dirname(target) : target
}
