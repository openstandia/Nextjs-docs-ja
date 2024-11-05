import { configs } from './configs.mts'

export type MdxFilePath = `${(typeof configs)['docsDir']}/${string}`

export function isMdxFilePath(path: string): path is MdxFilePath {
  return path.startsWith(`${configs.docsDir}/`)
}

export type DiffFile<T = string> = {
  submodule: string
  hash: {
    previous?: string
    current: string
  }
  diffs: T[]
}

export type MdxDiff = SingleFileMdxDiff | MultipleFileMdxDiff | UnknownMdxDiff

export type SingleFileMdxDiff = {
  status: 'A' | 'D' | 'M'
  score?: number
  filePath: MdxFilePath
}

export type MultipleFileMdxDiff = {
  status: 'R' | 'C'
  score?: number
  fromPath: MdxFilePath
  toPath: MdxFilePath
}

export type UnknownMdxDiff = {
  status: 'T' | 'U' | 'X' | 'B'
  score?: number
  data: string
}
