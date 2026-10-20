/* eslint-disable test/no-import-node-test -- These tests run on node:test. */
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, it } from 'node:test'
import { createFiles } from '../src/create-files.js'
import { createFolders } from '../src/create-folders.js'

const directories = []

function makeTempDirectory() {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'alfred-create-empty-'))
  directories.push(directory)
  return directory
}

afterEach(() => {
  for (const directory of directories.splice(0))
    fs.rmSync(directory, { recursive: true, force: true })
})

describe('createFiles', () => {
  it('creates a missing file and leaves an existing file untouched', () => {
    const directory = makeTempDirectory()
    const existing = path.join(directory, 'keep.txt')
    fs.writeFileSync(existing, 'original')
    const mtimeMs = fs.statSync(existing).mtimeMs

    createFiles({ target: directory, filenames: 'keep.txt\nnew.txt' })

    assert.equal(fs.readFileSync(existing, 'utf8'), 'original')
    assert.equal(fs.statSync(existing).mtimeMs, mtimeMs)
    assert.equal(fs.readFileSync(path.join(directory, 'new.txt'), 'utf8'), '')
  })

  it('creates a sibling of a selected file', () => {
    const directory = makeTempDirectory()
    const selected = path.join(directory, 'selected.txt')
    fs.writeFileSync(selected, 'keep')

    createFiles({ target: selected, filenames: '.hidden.txt' })

    assert.equal(fs.readFileSync(path.join(directory, '.hidden.txt'), 'utf8'), '')
    assert.equal(fs.readFileSync(selected, 'utf8'), 'keep')
  })

  it('rejects absolute names and names that contain ..', () => {
    const root = makeTempDirectory()
    const directory = path.join(root, 'inside')
    fs.mkdirSync(directory)
    const absolute = path.join(root, 'absolute.txt')

    assert.throws(() => createFiles({ target: directory, filenames: absolute }))
    assert.throws(() => createFiles({ target: directory, filenames: '../outside.txt\nok.txt' }))
    assert.throws(() => createFiles({ target: directory, filenames: 'foo/../../etc' }))
    assert.throws(() => createFiles({ target: directory, filenames: 'foo..bar' }))

    assert.equal(fs.existsSync(absolute), false)
    assert.equal(fs.existsSync(path.join(root, 'outside.txt')), false)
    assert.equal(fs.existsSync(path.join(directory, 'ok.txt')), false)
  })

  it('throws when filenames is missing', () => {
    const directory = makeTempDirectory()
    assert.throws(
      () => createFiles({ target: directory }),
      { message: 'Missing filenames environment variable' },
    )
  })
})

describe('createFolders', () => {
  it('creates nested folders and keeps an existing directory', () => {
    const directory = makeTempDirectory()
    fs.mkdirSync(path.join(directory, 'already'))

    createFolders({ target: directory, filenames: 'already\nnested/child' })

    assert.equal(fs.statSync(path.join(directory, 'already')).isDirectory(), true)
    assert.equal(fs.statSync(path.join(directory, 'nested/child')).isDirectory(), true)
  })

  it('creates a folder next to a selected file', () => {
    const directory = makeTempDirectory()
    const selected = path.join(directory, 'selected.txt')
    fs.writeFileSync(selected, 'keep')

    createFolders({ target: selected, filenames: 'child' })

    assert.equal(fs.statSync(path.join(directory, 'child')).isDirectory(), true)
  })

  it('exits non-zero when folder creation fails', () => {
    const directory = makeTempDirectory()
    fs.writeFileSync(path.join(directory, 'blocked'), 'not a directory')

    assert.throws(() => createFolders({ target: directory, filenames: 'blocked' }))

    const result = spawnSync(process.execPath, [
      '--input-type=module',
      '-e',
      `import { createFolders } from './src/create-folders.js'
       createFolders({ target: ${JSON.stringify(directory)}, filenames: 'blocked' })`,
    ], { encoding: 'utf8' })

    assert.notEqual(result.status, 0)
    assert.equal(fs.readFileSync(path.join(directory, 'blocked'), 'utf8'), 'not a directory')
  })

  it('rejects unsafe names before creating anything', () => {
    const directory = makeTempDirectory()

    assert.throws(() => createFolders({ target: directory, filenames: '/tmp/nope' }))
    assert.throws(() => createFolders({ target: directory, filenames: '../escape\nok' }))
    assert.equal(fs.existsSync(path.join(directory, 'ok')), false)
    assert.equal(fs.readdirSync(directory).length, 0)
  })

  it('throws when filenames is missing', () => {
    const directory = makeTempDirectory()
    assert.throws(
      () => createFolders({ target: directory, filenames: undefined }),
      { message: 'Missing filenames environment variable' },
    )
  })
})
