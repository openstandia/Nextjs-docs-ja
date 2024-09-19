import {
  BasicMdxDiff,
  removeFile,
  parseMdxDiff,
  PROJECT_ROOT,
  createLogger,
} from './utils.mts'
import path from 'node:path'
import { minimist } from 'zx'
import process from 'node:process'

const log = createLogger(path.basename(import.meta.url))

log('important', '🚀 started to sync deleted files.')

const args = minimist(process.argv.slice(2))

const {
  _: [filePath],
} = args

if (!filePath) {
  throw new Error('specify filepath as args.')
}

const diffs = await parseMdxDiff(
  path.join(path.isAbsolute(filePath) ? filePath : path.resolve(filePath))
)

const deleteFiles = diffs
  .filter((diff): diff is BasicMdxDiff => diff.status === 'D')
  .map((diff) => path.join(PROJECT_ROOT, diff.filePath))
  .map(async (path) => {
    log('normal', `deleting... ${path}`)
    return removeFile(path)
  })

//TODO renameの対応？

if (deleteFiles.length === 0) {
  log('important', 'NO deleted file found.')
} else {
  await Promise.all(deleteFiles)
}

log('important', `${deleteFiles.length} files deleted successfully.`)
log('important', '🎉 finished syncing deleted files.')
