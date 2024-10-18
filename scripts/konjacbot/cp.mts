/**
 * @fileoverview
 * This script handles file operations based on MDX diff information.
 * It copies, deletes, or renames files according to their status in the diff.
 * The script uses a configuration file and utility functions for parsing MDX diffs and logging.
 */

import path, { basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'
import { fs } from 'zx'

import { MdxDiff, createLogger, MdxFilePath, parseDiffFile } from './utils.mts'
import { configs } from './configs.mts'

const log = createLogger(basename(import.meta.filename))

const { projectRootDir } = configs

/**
 * Handles file operations based on the status of a given MdxDiff object.
 *
 * @param diff - An object representing the differences in MDX files, including the status and file paths.
 *
 * The function performs the following operations based on the status:
 * - 'A' (Added) or 'M' (Modified): Copies the file to the target location.
 * - 'D' (Deleted): Deletes the file from the target location.
 * - 'R' (Renamed): Deletes the file from the old path and copies it to the new path.
 *
 * @throws Will throw an error if the status is not supported.
 */
async function command(diff: MdxDiff): Promise<void> {
  async function cp(mdxFilePath: MdxFilePath): Promise<void> {
    const targetMdxFile = path.resolve(projectRootDir, submodule, mdxFilePath)
    const content = (await fs.readFile(targetMdxFile)).toString()

    const pathToWrite = path.resolve(projectRootDir, mdxFilePath)
    log('normal', `copying file to "${pathToWrite}"`)
    await fs.ensureDir(dirname(pathToWrite))
    await fs.writeFile(pathToWrite, content)
  }

  async function rm(mdxFilePath: MdxFilePath): Promise<void> {
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

log('important', '🚀 cp started !')

const {
  positionals: [diffFilePath],
} = parseArgs({
  allowPositionals: true,
})

const { submodule, diffs: diffList } = await parseDiffFile(
  path.isAbsolute(diffFilePath) ? diffFilePath : path.resolve(diffFilePath)
)

const commands = diffList.map((diff) => command(diff))

log('important', `${commands.length} files found.`)

await Promise.all(commands)

log('important', '✅ cp finished successfully !')
