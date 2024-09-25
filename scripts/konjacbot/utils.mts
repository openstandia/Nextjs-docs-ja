import path from 'node:path'
import { chalk, fs } from 'zx'
import { configs } from './configs.mts'

export const asyncFlatMap = async <T, R>(
  arr: T[],
  callback: (value: T, index: number, array: T[]) => Promise<R>
): Promise<FlatArray<Awaited<R>[], 1>[]> => {
  const a = await Promise.all(arr.map(callback))
  return a.flat()
}

export const wait = (sec: number) => {
  return new Promise<void>((r) => {
    setTimeout(() => {
      r()
    }, sec * 1_000)
  })
}

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

export type MdxDiff = BasicMdxDiff | RenamedMdxDiff | UnknownMdxDiff

function createMdxDiff(status: string, data: string): MdxDiff {
  const isMdxFilePath = (path: string): path is MdxFilePath => {
    return path.startsWith(configs.docsDir)
  }

  const createBaseMdxDiff = (
    status: BasicMdxDiff['status'],
    data: string
  ): BasicMdxDiff => {
    const items = data.split(/\s+/)
    if (items.length !== 1) {
      throw Error('invalid data') //TODO
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
      throw Error('invalid data') //TODO
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
      throw new Error('unknown status') //TODO
  }
}

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
