import { $, minimist } from 'zx'
import path, { basename } from 'node:path'
import process from 'node:process'
import { createLogger, writeFile } from './utils.mts'

const log = createLogger(basename(import.meta.url))

const args = minimist(process.argv.slice(2), {
  string: ['o'],
  alias: {
    o: 'output',
  },
}) as { output?: string }

log('important', `🚀 diff docs started`)

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

if (args.output) {
  const outputFilePath = path.isAbsolute(args.output)
    ? args.output
    : path.resolve(args.output)
  await writeFile(outputFilePath, docDiffLines)
  log('important', `wrote to ${outputFilePath}`)
}

log('important', '🎉 diff docs finished successfully')
