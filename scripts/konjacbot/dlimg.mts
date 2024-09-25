import path, { basename, dirname } from 'node:path'
import process from 'node:process'
import { argv, fs } from 'zx'
import pLimit from 'p-limit'
import { asyncFlatMap, createLogger, wait, parseMdxDiff } from './utils.mts'
import { configs } from '@site/scripts/konjacbot/configs.mts'
import { parseArgs } from 'node:util'

/*
 * definitions
 */

const { projectRootDir, submoduleName } = configs

const defaults = {
  outputDir: path.resolve(projectRootDir, 'static/img'),
  downloadEndpoint: 'https://nextjs.org/_next/image',
  delay: 5,
  concurrency: 2,
} as const

const log = createLogger(basename(import.meta.url))

const limit = pLimit(defaults.concurrency)

function parseImageComponent(
  content: string
): { srcLight?: string; srcDark?: string }[] {
  const codeBlockRegex = /```[\s\S]*?```/g
  const imageTagRegex =
    /<Image(?:[^>]*?srcLight="([^"]*)")?(?:[^>]*?srcDark="([^"]*)")?[^>]*?>/g

  const textWithoutCodeBlocks = content.replace(codeBlockRegex, '')

  let match: RegExpMatchArray | null
  const results = []

  while ((match = imageTagRegex.exec(textWithoutCodeBlocks)) !== null) {
    results.push({
      srcLight: match[1],
      srcDark: match[2],
    })
  }

  return results
}

async function downloadImage(imagePath: string, index: number): Promise<void> {
  const searchPrams = new URLSearchParams()
  searchPrams.append('url', imagePath)
  searchPrams.append('w', '3840')
  searchPrams.append('q', '75')
  const url = new URL(
    `${defaults.downloadEndpoint}?${searchPrams.toString()}`
  ).toString()

  log('normal', `[${index + 1}/${imagePathList.length}]downloading...${url}`)

  const res = await fetch(url, {
    headers: {
      Accept:
        'image/avif,image/webp,image/png,image/svg+xml,image/*;q=0.8,*/*;q=0.5',
    },
  })

  if (!res.ok) {
    throw new Error(`download image failed: URL=${url}`)
  }

  const header = res.headers.get('content-disposition')
  if (header == null) {
    throw Error(`invalid response header: "content-disposition" not found.`)
  }
  const parsedHeader = header.match(/^attachment; filename="(.+)"$/)
  if (!parsedHeader || parsedHeader.length !== 2) {
    throw Error(`invalid response header: "filename" not found.`)
  }
  const fileName = parsedHeader[1]

  const arrayBuffer = await res.arrayBuffer()
  const image = Buffer.from(arrayBuffer)

  const pathToWrite = path.resolve(
    path.join(defaults.outputDir, dirname(imagePath)),
    fileName
  )

  log(
    'normal',
    `[${index + 1}/${imagePathList.length}]writing...${pathToWrite}`
  )

  await fs.ensureDir(dirname(pathToWrite))
  return fs.writeFile(pathToWrite, image)
}

/*
 * entry point
 */

log('important', '🚀 started to download images !')

const {
  positionals: [diffFilePath],
} = parseArgs({
  allowPositionals: true,
})

const mdPathList = (
  await parseMdxDiff(
    path.isAbsolute(diffFilePath) ? diffFilePath : path.resolve(diffFilePath)
  )
)
  .filter((diff) => ['A', 'M', 'R'].includes(diff.status))
  .map((diff) => {
    if (diff.status === 'A' || diff.status === 'M') {
      return diff.filePath
    }
    if (diff.status === 'R') {
      return diff.toPath
    }
    throw Error(`NOT supported diff status: ${JSON.stringify(diff)}`)
  })

mdPathList.forEach((mdPath) => {
  log('normal', `📄md(x): ${mdPath}`)
})

log('important', `searching images from ${mdPathList.length} md(x) files.`)

const imagePathList = await asyncFlatMap(
  mdPathList.map((mdPath) =>
    fs.readFile(path.resolve(projectRootDir, submoduleName, mdPath))
  ),
  async (content) =>
    parseImageComponent((await content).toString())
      .flatMap((imagSrc) => [imagSrc.srcLight, imagSrc.srcDark])
      .filter((path) => path)
      .map((path) => path as string) //TODO type guard
)
const distinctImagePathList = Array.from(new Set(imagePathList))

distinctImagePathList.forEach((imagePath) => {
  log('normal', `🖼️image: ${imagePath}`)
})

log('important', `${distinctImagePathList.length} image files found.`)

const requests = distinctImagePathList.map((imagePath, index) => {
  return limit(async () => {
    // ダウンロード先に負荷をかけすぎないように、delayを入れる
    await wait(defaults.delay)
    return downloadImage(imagePath, index)
  })
})

await Promise.all(requests)

log('important', `downloaded ${distinctImagePathList.length} image files.`)
log('important', '✅  dlimg finished successfully!')
