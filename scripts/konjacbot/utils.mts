/**
 * @fileoverview This module provides utility functions for handling git diffs, managing MDX files, and logging.
 * The functions include parsing and creating MDX diffs, listing MDX files, and asynchronous utility functions.
 */

import path from 'node:path'
import OpenAI from 'openai'
import { chalk, fs } from 'zx'
import { configs } from './configs.mts'
import {
  DiffFile,
  isMdxFilePath,
  MdxDiff,
  MultipleFileMdxDiff,
  SingleFileMdxDiff,
  UnknownMdxDiff,
} from './types.mts'

/**
 * Asynchronously applies a callback to each element of an array, then flattens the result by one level.
 *
 * @template T, R
 * @param {T[]} arr - The array to iterate over.
 * @param {(value: T, index: number, array: T[]) => Promise<R>} callback - The function called per element.
 * @returns {Promise<FlatArray<Awaited<R>[], 1>[]>} A promise resolving to a new flattened array.
 */
export async function asyncFlatMap<T, R>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<R>
): Promise<FlatArray<Awaited<R>[], 1>[]> {
  const a = await Promise.all(arr.map(callback))
  return a.flat()
}

/**
 * Waits for a specified number of seconds.
 *
 * @param {number} sec - Number of seconds to wait.
 * @returns {Promise<void>} A promise that resolves after the specific time has elapsed.
 */
export async function wait(sec: number): Promise<void> {
  return new Promise<void>((r) => {
    setTimeout(() => {
      r()
    }, sec * 1_000)
  })
}

/**
 * Recursively lists all MDX files in a directory.
 *
 * @param {string} dir - The directory to search for MDX files.
 * @returns {string[]} An array of file paths.
 */
export function listMdxFilesRecursively(dir: string): string[] {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((dirent) =>
      dirent.isFile()
        ? [path.join(dir, dirent.name)]
        : listMdxFilesRecursively(path.join(dir, dirent.name))
    )
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
}

/**
 * Creates an MdxDiff object from a status and data string.
 *
 * @param {string} status - The git diff status.
 * @param {string} data - The relevant file path(s).
 * @returns {MdxDiff} An object representing the MDX diff.
 * @throws Will throw an error for invalid data or unknown status.
 */
function createMdxDiff({
  status,
  score,
  data,
}: {
  status: string
  score: string
  data: string
}): MdxDiff {
  const toScore = (score: string) => {
    if (!score) {
      return undefined
    }
    const scoreNum = Number.parseInt(score, 10)
    if (scoreNum === Number.NaN) {
      throw Error(`invalid score : ${scoreNum}`)
    }
    return scoreNum
  }

  const createSingleFileMdxDiff = (
    status: SingleFileMdxDiff['status'],
    score: string,
    data: string
  ): SingleFileMdxDiff => {
    const items = data.split(/\s+/)
    if (items.length !== 1) {
      throw Error('invalid data') // TODO
    }

    if (!isMdxFilePath(items[0])) {
      throw Error(`Invalid data. path must start with ${configs.docsDir}`)
    }

    return {
      status: status,
      score: toScore(score),
      filePath: items[0],
    }
  }

  const createMultipleFileMdxDiff = (
    status: MultipleFileMdxDiff['status'],
    score: string,
    data: string
  ): MultipleFileMdxDiff => {
    const items = data.split(/\s+/)
    if (items.length !== 2) {
      throw Error('invalid data') // TODO
    }

    if (!isMdxFilePath(items[0]) || !isMdxFilePath(items[1])) {
      throw Error(`Invalid data. path must start with ${configs.docsDir}`)
    }

    return {
      status: status,
      score: toScore(score),
      fromPath: items[0],
      toPath: items[1],
    }
  }

  const createUnknownMdxDiff = (
    status: UnknownMdxDiff['status'],
    score: string,
    data: string
  ): UnknownMdxDiff => {
    return {
      status: status,
      score: toScore(score),
      data: data,
    }
  }

  switch (status) {
    case 'A':
    case 'M':
    case 'D':
      return createSingleFileMdxDiff(status, score, data)
    case 'C':
    case 'R':
      return createMultipleFileMdxDiff(status, score, data)
    case 'T':
    case 'U':
    case 'X':
    case 'B':
      return createUnknownMdxDiff(status, score, data)
    default:
      throw new Error('unknown status') // TODO
  }
}

/**
 * Parses a diff file and returns its content.
 *
 * @template T - A boolean type that determines the return type of the diffs.
 * @param {string} filePath - The path to the diff file.
 * @param {Object} [options] - Optional parameters.
 * @param {T} [options.rawDiff] - If true, returns raw diff strings; otherwise, returns parsed MdxDiff objects.
 * @returns {Promise<DiffFile<T extends true ? string : MdxDiff>>} - A promise that resolves to the parsed diff file content.
 * @throws {Error} - Throws an error if a diff line cannot be parsed.
 */
export async function parseDiffFile<T extends boolean = false>(
  filePath: string,
  options?: {
    rawDiff?: T
  }
): Promise<DiffFile<T extends true ? string : MdxDiff>> {
  const versionFileString = (await fs.readFile(filePath)).toString()

  const versionFileObj = JSON.parse(versionFileString) as DiffFile

  if (options?.rawDiff) {
    return {
      ...versionFileObj,
      diffs: [...versionFileObj.diffs] as (T extends true ? string : MdxDiff)[],
    }
  }

  const diffs = versionFileObj.diffs.map((line, index) => {
    const match = line.match(/^([a-zA-Z])([0-9]{0,3})\s+(.+)$/)
    if (match && match.length === 4) {
      return createMdxDiff({
        status: match[1],
        score: match[2],
        data: match[3],
      })
    } else {
      throw new Error(`unknown diff format @line ${index + 1} : ${line}`)
    }
  })

  return {
    ...versionFileObj,
    diffs: [...diffs] as (T extends true ? string : MdxDiff)[],
  }
}

/**
 * Creates a logger function with a specific prefix.
 *
 * @param {string} prefix - A string to prefix to all log messages.
 * @returns {(type: 'normal' | 'important' | 'error', ...data: unknown[]) => void} A logger function.
 */
export function createLogger(prefix: string) {
  const palette = {
    normal: (m: string) => m,
    important: (m: string) => chalk.greenBright(m),
    error: (m: string) => chalk.redBright(m),
  } as const

  return (type: 'normal' | 'important' | 'error', ...data: unknown[]): void => {
    const [message, ...others] = data

    console.log(
      palette[type](`[${configs.botName}:${prefix}] ${message}`),
      ...others
    )
  }
}

/**
 * Creates an AI client that interacts with OpenAI's Chat API to fetch responses based on provided prompts.
 *
 * @param {OpenAI} openai - An instance of the OpenAI API client.
 * @returns {(prompt: { system: string; user: string }) => Promise<string>} A function that takes a prompt and returns the assistant's response as a string.
 */
export function createOpenAIClient(
  openai: OpenAI
): (prompt: { system: string; user: string }) => Promise<string> {
  async function fetch(prompt: {
    system: string
    user: string
  }): Promise<string> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ]

    let isComplete = false

    while (!isComplete) {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages,
        stream: false,
      })

      const choice = response.choices[0]
      const receivedText = choice.message?.content ?? ''

      messages.push({ role: 'assistant', content: receivedText })

      if (choice.finish_reason === 'stop') {
        isComplete = true
      } else if (choice.finish_reason !== 'length') {
        throw new Error('Unexpected finish reason')
      }
    }

    return messages
      .filter((msg) => msg.role === 'assistant')
      .map((msg) => msg.content)
      .join('')
  }

  return fetch
}

/**
 * Returns the current date and time as a string in the format YYYYMMDDHHMMSS.
 *
 * @returns {string} The current date and time as a string in the format YYYYMMDDHHMMSS.
 */
export function getCurrentDateTimeString(): string {
  return new Date().toISOString().replace(/[-:TZ.]/g, '')
}
