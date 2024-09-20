import OpenAI from 'openai'
import pLimit from 'p-limit'
import path, { basename, dirname } from 'node:path'
import process from 'node:process'
import { argv, spinner, fs } from 'zx'

import {
  parseMdxDiff,
  PROJECT_ROOT,
  MdxDiff,
  createLogger,
  parseArgs,
} from './utils.mts'

/*
 * Definitions
 */

const defaults = {
  apiKey: process.env.OPENAI_API_KEY,
  concurrency: 5,
  lang: 'ja',
  promptDir: path.join(import.meta.dirname, `prompt`),
  nextjsDir: path.join(PROJECT_ROOT, 'next.js'),
} as const

const log = createLogger(basename(import.meta.filename))

const limit = pLimit(defaults.concurrency)

/*
 * Entry point
 */

log('important', '🚀 translate started.')

const argsParseResult = parseArgs({
  description: `Translate files based on diff. The default language is "${defaults.lang}". `,
  usage: `tsx translate.mts [options] <diff-file-path> `,
  parser: (args) => {
    if (args._.length !== 1) {
      return {
        success: false,
        message: 'One diff file path must be specified as an argument.',
      }
    }
    const [diffFilePath] = args._

    let lang: string
    if (!args.l) {
      lang = defaults.lang
    } else if (typeof args.l !== 'string') {
      return {
        success: false,
        message: '"-l" option value must be a string.',
      }
    } else {
      lang = args.l
    }

    return {
      success: true,
      args: {
        diffFilePath,
        lang,
      },
    }
  },
})(argv)

if (!argsParseResult.success) {
  log('error', argsParseResult.message)
  process.exit(1)
}

const { args } = argsParseResult

const diffList = await parseMdxDiff(
  path.isAbsolute(args.diffFilePath)
    ? args.diffFilePath
    : path.resolve(args.diffFilePath)
)

const command = await (async () => {
  const openai = new OpenAI({
    apiKey: defaults.apiKey,
  })

  const systemContent = (
    await fs.readFile(path.resolve(defaults.promptDir, `${args.lang}.md`))
  ).toString()

  const translate = async (mdxFilePath: string) => {
    const targetMdxFile = path.resolve(defaults.nextjsDir, mdxFilePath)
    const userContent = (await fs.readFile(targetMdxFile)).toString()

    log('normal', `requesting to OpenAI to translate "${targetMdxFile}"`)
    const result = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemContent },
        { role: 'user', content: userContent },
      ],
      stream: false,
    })

    if (result.choices.length !== 1) {
      throw new Error(
        `invalid OpenAI translation result: ${JSON.stringify(result)}`
      )
    }
    const translatedContent = result.choices[0].message.content

    const pathToWrite = path.resolve(PROJECT_ROOT, mdxFilePath)
    log('normal', `writing translated files to "${pathToWrite}"`)
    await fs.ensureDir(dirname(pathToWrite))
    await fs.writeFile(pathToWrite, translatedContent ?? '')
  }

  const rm = async (mdxFilePath: string) => {
    const filePath = path.resolve(PROJECT_ROOT, mdxFilePath)
    log('normal', `deleting... ${filePath}`)
    return await fs.unlink(filePath)
  }

  return async (diff: MdxDiff) => {
    const { status } = diff

    switch (status) {
      case 'A':
      case 'M':
        return translate(diff.filePath)
      case 'D':
        return rm(diff.filePath)
      case 'R': {
        await rm(diff.fromPath)
        return translate(diff.toPath)
      }
      default:
        throw new Error(`NOT supported diff :  ${JSON.stringify(diff)}`)
    }
  }
})()

const commands = diffList.map((diff) => limit(() => command(diff)))

await spinner(() => Promise.all(commands))

log('important', '🎉 translate finished successfully!')
