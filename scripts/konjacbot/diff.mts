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

const { projectRootDir, submoduleName, docsDir } = configs

const log = createLogger(basename(import.meta.url))

/**
 * Lists all MDX files as added (A) diffs.
 *
 * @returns {string[]} An array of diff strings representing new files.
 */
function resolveAllAsDiff(): string[] {
  const submoduleDir = path.resolve(projectRootDir, submoduleName)
  const enDocsDir = path.resolve(submoduleDir, docsDir)
  const files = listMdxFilesRecursively(enDocsDir)
  return files.map((f) => {
    const filePath = path.relative(submoduleDir, f)
    return `A\t${filePath}`
  })
}

/**
 * Resolves differences in the submodule documentation based on commit hashes.
 *
 * @returns {Promise<string[]>} A promise resolving to an array of diff strings.
 */
async function resolveDiff(): Promise<string[]> {
  const submoduleDiffOutput = await $`git diff -- ${submoduleName}`

  const hash = {
    before: submoduleDiffOutput
      .text()
      .match(/^-Subproject commit ([0-9a-zA-Z]+)$/m)?.[1],
    after: submoduleDiffOutput
      .text()
      .match(/^\+Subproject commit ([0-9a-zA-Z]+)$/m)?.[1],
  }

  if (!hash.before || !hash.after) {
    log('important', 'submodule is up to date.')
    return []
  }

  log('normal', `hash: ${hash.before}..${hash.after}`)

  return within(async () => {
    $.cwd = configs.submoduleName

    const docDiffOutput =
      await $`git diff -M100% --name-status ${hash.before}..${hash.after} -- ${docsDir}`

    return docDiffOutput
      .text()
      .split('\n')
      .filter((line) => line.trim())
  })
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

await $`git submodule update --remote`

const diffLines = args.all ? resolveAllAsDiff() : await resolveDiff()

log('important', `${diffLines.length} different docs found.`)

diffLines.forEach((line) => {
  log('normal', `diff: ${line}`)
})

if (args.outputFilePath) {
  const pathToWrite = path.isAbsolute(args.outputFilePath)
    ? args.outputFilePath
    : path.resolve(args.outputFilePath)

  const content = diffLines.reduce((prev, current, index) => {
    return `${prev}${index === 0 ? '' : '\n'}${current}`
  }, '')

  log('important', `writing diffs to "${pathToWrite}"`)
  await fs.ensureDir(dirname(pathToWrite))
  await fs.writeFile(pathToWrite, content)
}

log('important', '✅ diff docs finished successfully !')
