import { $, argv, fs } from 'zx'
import path, { basename } from 'node:path'
import process from 'node:process'
import { createLogger, parseArgs } from './utils.mts'

const log = createLogger(basename(import.meta.url))

log('important', `🚀 diff docs started`)

const argsParseResult = parseArgs({
  description: `Diff docs in "next.js" repository. If you want to save diff to files, please specify "-o <file-path>".`,
  usage: `tsx diff-docs.mts [options]`,
  parser: (args) => {
    let outputFilePath: string | undefined
    if (args.o == null) {
      outputFilePath = undefined
    } else if (typeof args.o === 'string') {
      outputFilePath = args.o
    } else {
      return {
        success: false,
        message: '"-o" option value must be a string.',
      }
    }

    return {
      success: true,
      args: {
        outputFilePath,
      },
    }
  },
})(argv)

if (!argsParseResult.success) {
  log('error', argsParseResult.message)
  process.exit(1)
}

const { args } = argsParseResult

await $`git submodule update --remote`
const submoduleDiffOutput = await $`git diff -- next.js`

const hash = {
  before: submoduleDiffOutput
    .text()
    .match(/^-Subproject commit ([0-9a-zA-Z]+)$/m)?.[1],
  after: submoduleDiffOutput
    .text()
    .match(/^\+Subproject commit ([0-9a-zA-Z]+)$/m)?.[1],
}

if (!hash.before || !hash.after) {
  log('important', 'No diff found. submodule is up to date.')
  process.exit(0)
}

log('normal', `hash: ${hash.before}..${hash.after}`)

const docDiffOutput =
  await $`git submodule foreach git diff -M100% --name-status ${hash.before}..${hash.after} -- docs`

const docDiffLines = docDiffOutput
  .text()
  .split('\n')
  .filter((line) => line)
  .filter((line) => !line.startsWith('Entering'))

docDiffLines.forEach((line) => {
  log('normal', `diff: ${line}`)
})

if (args.outputFilePath) {
  const pathToWrite = path.isAbsolute(args.outputFilePath)
    ? args.outputFilePath
    : path.resolve(args.outputFilePath)

  const content = docDiffLines.reduce((prev, current, index) => {
    return `${prev}${index === 0 ? '' : '\n'}${current}`
  }, '')

  log('important', `writing diffs to ${pathToWrite}`)
  await fs.writeFile(pathToWrite, content)
}

log('important', '🎉 diff docs finished successfully')
