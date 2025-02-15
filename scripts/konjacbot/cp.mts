/**
 * @fileoverview
 * This script handles file operations based on MDX diff information.
 * It copies, deletes, or renames files according to their status in the diff.
 * The script uses a configuration file and utility functions for parsing MDX diffs and logging.
 */

import path, { basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'
import { fs } from 'zx'

import { createLogger, parseDiffFile } from './utils.mts'
import { configs } from './configs.mts'
import { MdxDiff, MdxFilePath } from './types.mts'

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
  const cp = async (mdxFilePath: MdxFilePath) => {
    const fromPath = path.resolve(projectRootDir, submodule, mdxFilePath)
    const toPath = path.resolve(projectRootDir, mdxFilePath)
    log('normal', `copying... "${fromPath}" -> "${toPath}"`)
    await fs.ensureDir(dirname(toPath))
    await fs.copyFile(fromPath, toPath)
  }

  const rm = async (mdxFilePath: MdxFilePath) => {
    const filePath = path.resolve(projectRootDir, mdxFilePath)
    log('normal', `deleting... ${filePath}`)
    return await fs.unlink(filePath)
  }

  const mv = async (
    fromMdxFilePath: MdxFilePath,
    toMdxFilePath: MdxFilePath
  ) => {
    const fromPath = path.resolve(projectRootDir, fromMdxFilePath)
    const toPath = path.resolve(projectRootDir, toMdxFilePath)
    log('normal', `moving... "${fromPath}" -> "${toPath}"`)
    await fs.ensureDir(dirname(toPath))
    await fs.copyFile(fromPath, toPath)
    await fs.unlink(fromPath)
  }

  const { status } = diff

  switch (status) {
    case 'A':
    case 'M':
      return cp(diff.filePath)
    case 'D':
      return rm(diff.filePath)
    case 'R': {
      if (diff.score === 100) {
        return mv(diff.fromPath, diff.toPath)
      } else {
        await rm(diff.fromPath)
        return cp(diff.toPath)
      }
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
  path.resolve(diffFilePath)
)

const commands = diffList.map((diff) => command(diff))

log('important', `${commands.length} files found.`)

await Promise.all(commands)

log('important', '✅ cp finished successfully !')
