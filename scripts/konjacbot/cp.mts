/**
 * @fileoverview
 * This script handles file operations based on MDX diff information.
 * It copies, deletes, or renames files according to their status in the diff.
 * The script uses a configuration file and utility functions for parsing MDX diffs and logging.
 */

import path, { basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'
import { fs } from 'zx'

import { parseMdxDiff, MdxDiff, createLogger, MdxFilePath } from './utils.mts'
import { configs } from './configs.mts'

const log = createLogger(basename(import.meta.filename))

const { projectRootDir, submoduleName } = configs

log('important', '🚀 cp started !')

const {
  positionals: [diffFilePath],
} = parseArgs({
  allowPositionals: true,
})

const diffList = await parseMdxDiff(
  path.isAbsolute(diffFilePath) ? diffFilePath : path.resolve(diffFilePath)
)

const command = async (diff: MdxDiff) => {
  const cp = async (mdxFilePath: MdxFilePath) => {
    const targetMdxFile = path.resolve(
      projectRootDir,
      submoduleName,
      mdxFilePath
    )
    const content = (await fs.readFile(targetMdxFile)).toString()

    const pathToWrite = path.resolve(projectRootDir, mdxFilePath)
    log('normal', `copying file to "${pathToWrite}"`)
    await fs.ensureDir(dirname(pathToWrite))
    await fs.writeFile(pathToWrite, content)
  }

  const rm = async (mdxFilePath: MdxFilePath) => {
    const filePath = path.resolve(projectRootDir, mdxFilePath)
    log('normal', `deleting... ${filePath}`)
    return await fs.unlink(filePath)
  }

  const { status } = diff

  switch (status) {
    case 'A':
    case 'M':
      return cp(diff.filePath)
    case 'D':
      return rm(diff.filePath)
    case 'R': {
      await rm(diff.fromPath)
      return cp(diff.toPath)
    }
    default:
      throw new Error(`NOT supported diff :  ${JSON.stringify(diff)}`)
  }
}

const commands = diffList.map((diff) => command(diff))

log('important', `${commands.length} files found.`)

await Promise.all(commands)

log('important', '✅ cp finished successfully !')
