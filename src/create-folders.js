/* eslint-disable no-console -- Run Script stdout is the progress Alfred displays. */
import fs from 'node:fs'
import path from 'node:path'
import { assertSafeName, parseFilenames, resolveParentDirectory } from './names.js'

export function createFolders({ target, filenames }) {
  const names = parseFilenames(filenames)
  for (const name of names)
    assertSafeName(name)

  const folder = resolveParentDirectory(target)

  for (const name of names) {
    const directory = path.join(folder, name)
    console.log(`Creating: ${directory}`)
    try {
      fs.mkdirSync(directory, { recursive: true })
      console.log(`Created: ${directory}`)
    }
    catch (error) {
      console.error(error)
      throw error
    }
  }
}
