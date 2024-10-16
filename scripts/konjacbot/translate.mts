/**
 * @fileoverview
 * This script manages the translation of MDX files based on git diffs using the OpenAI API.
 * It processes various file status changes (Added, Modified, Deleted, Renamed) and applies
 * appropriate actions such as translation or deletion. Key features include:
 * - Utilizes OpenAI API for language translation with customizable prompts
 * - Handles concurrent API requests with rate limiting
 * - Supports multiple languages through command-line options
 * - Processes git diff information to determine which files need translation
 * - Manages file system operations for reading, writing, and ensuring directories
 * The script is designed to work within a project structure and uses environment variables
 * for API authentication. It provides logging for tracking the translation process and
 * handles different file statuses appropriately.
 */

import OpenAI from 'openai'
import pLimit from 'p-limit'
import path, { basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'
import process from 'node:process'
import { spinner, fs } from 'zx'

import {
  parseMdxDiff,
  MdxDiff,
  createLogger,
  MdxFilePath,
  createAIClient,
} from './utils.mts'
import { configs } from './configs.mts'

const defaults = {
  apiKey: process.env.OPENAI_API_KEY,
  concurrency: 2, // See https://platform.openai.com/account/rate-limits
  lang: 'ja',
  promptDir: path.join(import.meta.dirname, `prompt`),
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

const diffList = await parseMdxDiff(
  path.isAbsolute(diffFilePath) ? diffFilePath : path.resolve(diffFilePath)
)

/**
 * A function to handle translation, deletion, and renaming of files based on diff status.
 *
 * Translations are performed using the OpenAI API, which is configured using the user-specific API key
 * and language based prompts.
 */
const command = await (async () => {
  const requestAI = createAIClient(
    new OpenAI({
      apiKey: defaults.apiKey,
    })
  )

  const systemContent = (
    await fs.readFile(path.resolve(defaults.promptDir, `${lang}.md`))
  ).toString()

  const translate = async (mdxFilePath: MdxFilePath) => {
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

await spinner(() => Promise.all(commands))

log('important', '✅ translation finished successfully !')
