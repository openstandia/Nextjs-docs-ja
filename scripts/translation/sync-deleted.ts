import {
  BasicMdxDiff,
  removeFile,
  parseMdxDiff,
  PROJECT_ROOT,
  createLogger,
} from './utils'
import path from 'node:path'
import { program } from 'commander'

const log = createLogger(path.basename(import.meta.url))

async function main() {
  try {
    log('important', '🚀 started to sync deleted files.')

    program
      .description('Synchronize files deleted from the reference repository.')
      .name('filePath')
      .argument(
        '-<filePath>',
        `Specify the file with the path list of the md(x) file from which you want to delete.`
      )

    const [option] = program.parse().args

    const diffs = await parseMdxDiff(
      path.join(path.isAbsolute(option) ? option : path.resolve(option)) //TODO コマンドからとる
    )

    const deleteFiles = diffs
      .filter((diff): diff is BasicMdxDiff => diff.status === 'D')
      .map((diff) => path.join(PROJECT_ROOT, diff.filePath))
      .map(async (path) => {
        log('normal', `deleting... ${path}`)
        return removeFile(path)
      })

    if (deleteFiles.length === 0) {
      log('important', 'NO deleted file found.')
    } else {
      await Promise.all(deleteFiles)
    }

    log('important', `${deleteFiles.length} files deleted successfully.`)
    log('important', '🎉 finished syncing deleted files.')
  } catch (e) {
    log('error', 'failed to sync deleted files.', e)
    throw e
  }
}

void main()
