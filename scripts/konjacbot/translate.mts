import OpenAI from 'openai'
import pLimit from 'p-limit'
import path, { basename, dirname } from 'node:path'
import { parseArgs } from 'node:util'
import process from 'node:process'
import { spinner, fs } from 'zx'

import { parseMdxDiff, MdxDiff, createLogger, MdxFilePath } from './utils.mts'
import { configs } from './configs.mts'

/*
 * definitions
 */

const defaults = {
  apiKey: process.env.OPENAI_API_KEY,
  concurrency: 5,
  lang: 'ja',
  promptDir: path.join(import.meta.dirname, `prompt`),
} as const

const log = createLogger(basename(import.meta.filename))

const limit = pLimit(defaults.concurrency)

const { projectRootDir, submoduleName, docsDir } = configs

/*
 * entry point
 */

log('important', '🚀 translate started !')

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

const command = await (async () => {
  const openai = new OpenAI({
    apiKey: defaults.apiKey,
  })

  const systemContent = (
    await fs.readFile(path.resolve(defaults.promptDir, `${lang}.md`))
  ).toString()

  const translate = async (mdxFilePath: MdxFilePath) => {
    const targetMdxFile = path.resolve(
      projectRootDir,
      submoduleName,
      mdxFilePath
    )
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

    const pathToWrite = path.resolve(projectRootDir, mdxFilePath)
    log('normal', `writing translated files to "${pathToWrite}"`)
    await fs.ensureDir(dirname(pathToWrite))
    await fs.writeFile(pathToWrite, translatedContent ?? '')
  }

  const rm = async (mdxFilePath: MdxFilePath) => {
    const filePath = path.resolve(projectRootDir, mdxFilePath)
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
