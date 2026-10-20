/* eslint-disable no-console -- Run Script stdout is the progress Alfred displays. */
import fs from 'node:fs'
import path from 'node:path'
import { assertSafeName, parseFilenames, resolveParentDirectory } from './names.js'

export function createFiles({ target, filenames }) {
  const names = parseFilenames(filenames)
  for (const name of names)
    assertSafeName(name)

  const folder = resolveParentDirectory(target)

  for (const name of names) {
    const filepath = path.join(folder, name)
    if (fs.existsSync(filepath)) {
      console.log(`Exists: ${filepath}`)
      continue
    }

    console.log(`Creating: ${filepath}`)
    try {
      const fileDescriptor = fs.openSync(filepath, 'wx')
      fs.closeSync(fileDescriptor)
    }
    catch (error) {
      if (error?.code === 'EEXIST') {
        console.log(`Exists: ${filepath}`)
        continue
      }

      throw error
    }
  }
}
