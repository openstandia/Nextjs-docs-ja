/**
 * @fileoverview This script computes differences in documentation files within a git submodule
 * and writes them to a specified output file if provided.
 * It supports handling both incremental and full diffs of documentation changes.
 */

import { $, fs, within } from 'zx'
import path, { basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'

import { createLogger, listMdxFilesRecursively } from './utils.mts'
import { configs } from './configs.mts'
import { DiffFile } from './types.mts'

const { projectRootDir, submoduleName, docsDir } = configs

$.verbose = true

const log = createLogger(basename(import.meta.url))

/**
 * Retrieves the hash of the submodule.
 *
 * This function executes the `git submodule` command to get the submodule information,
 * extracts the hash from the output, and returns it.
 *
 * @returns {Promise<string>} A promise that resolves to the submodule hash.
 * @throws {Error} If the submodule hash cannot be resolved.
 */
async function getSubmoduleHash(): Promise<string> {
  const submodule = (await $`git submodule`).text()

  const submoduleHashFound = submodule.match(/\b[0-9a-f]{40}\b/)
  if (submoduleHashFound == null || submoduleHashFound.length !== 1) {
    throw Error('failed to resolve submodule hash.')
  }

  return submoduleHashFound[0].substring(0, 40)
}

/**
 * Resolves all files as a diff based on the provided hash difference.
 *
 * @param hashDiff - An object containing the current hash of the diff file.
 * @returns A promise that resolves to a `DiffFile` object containing the submodule name, current hash, and a list of diffs.
 */
function resolveAllAsDiff(hashDiff: DiffFile['hash']): Promise<DiffFile> {
  const submoduleDir = path.resolve(projectRootDir, submoduleName)
  const sudmobuleDocsDir = path.resolve(submoduleDir, docsDir)
  const files = listMdxFilesRecursively(sudmobuleDocsDir)

  return Promise.resolve({
    submodule: submoduleName,
    hash: {
      current: hashDiff.current,
    },
    diffs: files.map((f) => {
      const filePath = path.relative(submoduleDir, f)
      return `A\t${filePath}`
    }),
  })
}

/**
 * Resolves the git diff for a given hash difference.
 *
 * @param hashDiff - An object containing the previous and current hash values.
 * @returns A promise that resolves to a `DiffFile` object containing the submodule name, hash details, and the list of diffs.
 */
async function resolveGitDiff(hashDiff: DiffFile['hash']): Promise<DiffFile> {
  if (hashDiff.previous === hashDiff.current) {
    log('important', 'submodule is up to date.')

    return {
      submodule: submoduleName,
      hash: {
        ...hashDiff,
      },
      diffs: [],
    }
  }

  log('normal', `hash: ${hashDiff.previous}..${hashDiff.current}`)

  return within(async () => {
    $.cwd = submoduleName

    const docDiffOutput =
      await $`git diff -M100% --name-status ${hashDiff.previous}..${hashDiff.current} -- ${docsDir}`

    return {
      submodule: submoduleName,
      hash: {
        ...hashDiff,
      },
      diffs: docDiffOutput
        .text()
        .split('\n')
        .filter((line) => line.trim()),
    }
  })
}

/**
 * Filters out specific diffs from a DiffFile object based on predefined criteria.
 *
 * @param {DiffFile} diffFile - The DiffFile object containing diffs to be filtered.
 * @returns {DiffFile} - A new DiffFile object with the filtered diffs.
 *
 */
function filterDiffs(diffFile: DiffFile): DiffFile {
  const predicate = (diff: string) => {
    if (diff.includes('docs/03-pages/')) {
      log(
        'normal',
        `ignore the diff because of the documentation about the pages router: ${diff}`
      )
      return false
    }

    return true
  }

  return {
    ...diffFile,
    diffs: [...diffFile.diffs.filter(predicate)],
  }
}

log('important', `🚀 diff docs started !`)

const { values: args } = parseArgs({
  options: {
    outputFilePath: {
      short: 'o',
      type: 'string',
    },
    all: {
      short: 'a',
      type: 'boolean',
    },
  },
})

const submoduleHashPrev = await getSubmoduleHash()

await $`git submodule update --remote`

const submoduleHashCurrent = await getSubmoduleHash()

const resolveDiff = args.all ? resolveAllAsDiff : resolveGitDiff

const versionFileObj = filterDiffs(
  await resolveDiff({
    previous: submoduleHashPrev,
    current: submoduleHashCurrent,
  })
)

log('important', `${versionFileObj.diffs.length} different docs found.`)

const versionFileContentString = JSON.stringify(versionFileObj, null, '\t')

log('important', versionFileContentString)

if (args.outputFilePath) {
  const pathToWrite = path.resolve(args.outputFilePath)

  log('important', `writing diffs to "${pathToWrite}"`)
  await fs.ensureDir(dirname(pathToWrite))
  await fs.writeFile(pathToWrite, versionFileContentString)
}

log('important', '✅ diff docs finished successfully !')
