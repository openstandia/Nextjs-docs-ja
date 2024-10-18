/**
 * @fileoverview
 * This script manages the translation of MDX files based on git diffs using the OpenAI API.
 */

import OpenAI from 'openai'
import pLimit from 'p-limit'
import path, { basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'
import process from 'node:process'
import { spinner, fs } from 'zx'

import {
  parseDiffFile,
  MdxDiff,
  createLogger,
  MdxFilePath,
  createOpenAIClient,
} from './utils.mts'
import { configs } from './configs.mts'

const defaults = {
  apiKey: process.env.OPENAI_API_KEY,
  concurrency: 2, // See https://platform.openai.com/account/rate-limits
  lang: 'ja',
  promptDir: path.join(import.meta.dirname, `prompt`),
  isCI: process.env.CI ?? false,
} as const

const log = createLogger(basename(import.meta.filename))

const limit = pLimit(defaults.concurrency)

const { projectRootDir } = configs

log('important', '🚀 translation started !')

const {
  positionals: [diffFilePath],
  values: { lang },
} = parseArgs({
  allowPositionals: true,
  options: {
    lang: {
      type: 'string',
      short: 'l',
      default: defaults.lang,
    },
  },
})

const { diffs: diffList } = await parseDiffFile(
  path.isAbsolute(diffFilePath) ? diffFilePath : path.resolve(diffFilePath)
)

const command = await (async () => {
  const requestAI = createOpenAIClient(
    new OpenAI({
      apiKey: defaults.apiKey,
    })
  )

  const systemContent = (
    await fs.readFile(path.resolve(defaults.promptDir, `${lang}.md`))
  ).toString()

  async function translate(mdxFilePath: MdxFilePath): Promise<void> {
    const targetMdxFile = path.resolve(projectRootDir, mdxFilePath)
    const userContent = (await fs.readFile(targetMdxFile)).toString()

    log('normal', `requesting to OpenAI to translate "${targetMdxFile}"`)

    const translatedContent = await requestAI({
      system: systemContent,
      user: userContent,
    })

    const pathToWrite = path.resolve(projectRootDir, mdxFilePath)
    log('normal', `writing translated files to "${pathToWrite}"`)
    await fs.ensureDir(dirname(pathToWrite))
    await fs.writeFile(pathToWrite, translatedContent)
  }

  return async (diff: MdxDiff) => {
    const { status } = diff

    switch (status) {
      case 'A':
      case 'M':
        return translate(diff.filePath)
      case 'D':
        log(
          'normal',
          `skipping translationg because this file is deleted : "${diff.filePath}"`
        )
        return
      case 'R': {
        return translate(diff.toPath)
      }
      default:
        throw new Error(`NOT supported diff :  ${JSON.stringify(diff)}`)
    }
  }
})()

const commands = diffList.map((diff) => limit(() => command(diff)))

log('important', `${commands.length} files to translate found.`)

const withSpinner = defaults.isCI
  ? (fn: () => Promise<unknown>) => fn()
  : spinner

await withSpinner(() => Promise.all(commands))

log('important', '✅ translation finished successfully !')
