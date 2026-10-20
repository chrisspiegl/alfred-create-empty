import process from 'node:process'
import alfy from 'alfy'
import hasFlag from 'has-flag'
import { createFiles } from './src/create-files.js'
import { createFolders } from './src/create-folders.js'

const options = {
  target: alfy.input,
  filenames: process.env.filenames,
}

if (hasFlag('folders'))
  createFolders(options)
else if (hasFlag('files'))
  createFiles(options)
