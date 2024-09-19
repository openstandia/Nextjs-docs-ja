import fs from 'node:fs'
import path from 'node:path'
import { chalk } from 'zx'

export const PROJECT_ROOT = path.normalize(`${import.meta.dirname}/../..`)

export async function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data.toString())
      }
    })
  })
}

export async function removeFile(path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}

export async function writeFile(
  path: string,
  content: string | string[]
): Promise<void> {
  let contentString: string
  if (Array.isArray(content)) {
    contentString = content.join('\n')
  } else {
    contentString = content
  }

  return new Promise((resolve, reject) => {
    fs.writeFile(path, contentString, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
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

export type BasicMdxDiff = {
  status: 'A' | 'D' | 'M'
  filePath: string
}

export type RenamedMdxDiff = {
  status: 'R'
  fromPath: string
  toPath: string
}

export type UnknownMdxDiff = {
  status: 'C' | 'T' | 'U' | 'X' | 'B' | ' '
  data: string
}

export type MdxDiff = BasicMdxDiff | RenamedMdxDiff | UnknownMdxDiff

function createMdxDiff(status: string, data: string): MdxDiff {
  const createBaseMdxDiff = (
    status: BasicMdxDiff['status'],
    data: string
  ): BasicMdxDiff => {
    const items = data.split(/\s+/)
    if (items.length !== 1) {
      throw Error('invalid data') //TODO
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
  const content = await readFile(filePath)

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

    console.log(palette[type](`[${prefix}] ${message}`), ...others)
  }
}
