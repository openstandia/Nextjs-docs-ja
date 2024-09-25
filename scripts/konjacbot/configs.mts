import path from 'node:path'

export const configs = {
  projectRootDir: path.normalize(`${import.meta.dirname}/../..`),
  submoduleName: 'next.js',
  docsDir: 'docs',
} as const
