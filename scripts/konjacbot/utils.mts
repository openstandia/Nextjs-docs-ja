/**
 * @fileoverview This module provides utility functions for handling git diffs, managing MDX files, and logging.
 * The functions include parsing and creating MDX diffs, listing MDX files, and asynchronous utility functions.
 */

import path from 'node:path'
import { chalk, fs } from 'zx'
import { configs } from './configs.mts'

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

export type MdxFilePath = `${(typeof configs)['docsDir']}/${string}`

/**
 * Checks whether the given path is of type MdxFilePath.
 *
 * @param {string} path - The path to check.
 * @returns {path is MdxFilePath} True if the path is an MDX file path.
 */
export function isMdxFilePath(path: string): path is MdxFilePath {
  return path.startsWith(`${configs.docsDir}/`)
}

export type MdxDiff = BasicMdxDiff | RenamedMdxDiff | UnknownMdxDiff

export type BasicMdxDiff = {
  status: 'A' | 'D' | 'M'
  filePath: MdxFilePath
}

export type RenamedMdxDiff = {
  status: 'R'
  fromPath: MdxFilePath
  toPath: MdxFilePath
}

export type UnknownMdxDiff = {
  status: 'C' | 'T' | 'U' | 'X' | 'B' | ' '
  data: string
}

/**
 * Creates an MdxDiff object from a status and data string.
 *
 * @param {string} status - The git diff status.
 * @param {string} data - The relevant file path(s).
 * @returns {MdxDiff} An object representing the MDX diff.
 * @throws Will throw an error for invalid data or unknown status.
 */
function createMdxDiff(status: string, data: string): MdxDiff {
  const createBaseMdxDiff = (
    status: BasicMdxDiff['status'],
    data: string
  ): BasicMdxDiff => {
    const items = data.split(/\s+/)
    if (items.length !== 1) {
      throw Error('invalid data') // TODO
    }

    if (!isMdxFilePath(items[0])) {
      throw Error(`Invalid data. path must start with ${configs.docsDir}`)
    }

    return {
      status: status,
      filePath: items[0],
    }
  }

  const createRenamedMdxDiff = (
    status: RenamedMdxDiff['status'],
    data: string
  ): RenamedMdxDiff => {
    const items = data.split(/\s+/)
    if (items.length !== 2) {
      throw Error('invalid data') // TODO
    }

    if (!isMdxFilePath(items[0]) || !isMdxFilePath(items[1])) {
      throw Error(`Invalid data. path must start with ${configs.docsDir}`)
    }

    return {
      status: status,
      fromPath: items[0],
      toPath: items[1],
    }
  }

  const createUnknownMdxDiff = (
    status: UnknownMdxDiff['status'],
    data: string
  ): UnknownMdxDiff => {
    return {
      status: status,
      data: data,
    }
  }

  const normalizedStatus = status.startsWith('R') ? 'R' : status

  switch (normalizedStatus) {
    case 'A':
    case 'M':
    case 'D':
      return createBaseMdxDiff(normalizedStatus, data)
    case 'R':
      return createRenamedMdxDiff(normalizedStatus, data)
    case 'C':
    case 'T':
    case 'U':
    case 'X':
    case 'B':
    case ' ':
      return createUnknownMdxDiff(normalizedStatus, data)
    default:
      throw new Error('unknown status') // TODO
  }
}

/**
 * Parses a file containing MDX diff information.
 *
 * @param {string} filePath - Path to the file containing diff information.
 * @returns {Promise<MdxDiff[]>} A promise resolving to an array of MdxDiff objects.
 * @throws Will throw an error for unknown diff or format irregularities.
 */
export async function parseMdxDiff(filePath: string): Promise<MdxDiff[]> {
  const content = (await fs.readFile(filePath)).toString()

  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line)
    .map((line, index) => {
      const match = line.match(/^(\S+|\s)\s+(\S.+)$/)
      if (match && match.length === 3) {
        return createMdxDiff(match[1].trim(), match[2].trim())
      } else {
        throw new Error(`unknown diff @ line ${index + 1} : ${line}`)
      }
    })
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
