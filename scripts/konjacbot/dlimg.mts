/**
 * @fileoverview This script downloads images referenced in MDX files based on git diffs.
 * It ensures concurrency control and includes a delay between requests to manage load.
 */

import path, { basename, dirname } from 'node:path'
import { fs } from 'zx'
import pLimit from 'p-limit'
import { asyncFlatMap, createLogger, wait, parseDiffFile } from './utils.mts'
import { configs } from '@site/scripts/konjacbot/configs.mts'
import { parseArgs } from 'node:util'

const { projectRootDir } = configs

const defaults = {
  outputDir: path.resolve(projectRootDir, 'static/img'),
  downloadEndpoint: 'https://nextjs.org/_next/image',
  delay: 5, // sec
  concurrency: 2,
} as const

const log = createLogger(basename(import.meta.url))

const limit = pLimit(defaults.concurrency)

/**
 * Parses the content to find Next.js <Image> components and their srcLight and srcDark attributes.
 *
 * @param {string} content - The content of an MDX file.
 * @returns {{ srcLight?: string; srcDark?: string }[]} An array of objects containing image sources.
 */
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

/**
 * Downloads an image from a specified path and saves it to a local directory.
 *
 * @param {string} imagePath - The source path of the image to download.
 * @param {number} index - The index of the current download task.
 * @param {string[]} imagePathList - The array of source path ot the image to download.
 * @returns {Promise<void>} A promise that resolves when the image is downloaded and saved.
 * @throws Will throw an error if the download or file writing fails.
 */
async function downloadImage(
  imagePath: string,
  index: number,
  imagePathList: string[]
): Promise<void> {
  //例：https://nextjs.org/_next/image?url=https%3A%2F%2Fh8DxKfmAPhn8O0p3.public.blob.vercel-storage.com%2Fdocs%2Fdark%2Ftypescript-command-palette.png&w=1920&q=75
  const searchPrams = new URLSearchParams()
  searchPrams.append(
    'url',
    `https://h8DxKfmAPhn8O0p3.public.blob.vercel-storage.com${imagePath}`
  )
  searchPrams.append('w', '1920')
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

log('important', '🚀 started to download images !')

const {
  positionals: [diffFilePath],
} = parseArgs({
  allowPositionals: true,
})

const { diffs, submodule } = await parseDiffFile(path.resolve(diffFilePath))

const mdPathList = diffs
  .map((diff) => {
    if (diff.status === 'A' || diff.status === 'M') {
      return diff.filePath
    }
    if (diff.status === 'R') {
      if (diff.score === 100) {
        log('normal', `skipping download for R100 file: ${diff.toPath}`)
        return undefined
      }
      return diff.toPath
    }
    if (diff.status === 'D') {
      log('normal', `skipping download for deleted file: ${diff.filePath}`)
      return undefined
    }
    throw Error(`NOT supported diff status: ${JSON.stringify(diff)}`)
  })
  .filter((path) => path != null)

mdPathList.forEach((mdPath) => {
  log('normal', `📄md(x): ${mdPath}`)
})

log('important', `searching images from ${mdPathList.length} md(x) files.`)

const imagePathList = await asyncFlatMap(
  mdPathList.map((mdPath) =>
    fs.readFile(path.resolve(projectRootDir, submodule, mdPath))
  ),
  async (content) =>
    parseImageComponent((await content).toString())
      .flatMap((imagSrc) => [imagSrc.srcLight, imagSrc.srcDark])
      .filter((path) => path != null)
)
const distinctImagePathList = Array.from(new Set(imagePathList))

distinctImagePathList.forEach((imagePath) => {
  log('normal', `🖼️image: ${imagePath}`)
})

log('important', `${distinctImagePathList.length} image files found.`)

const requests = distinctImagePathList.map((imagePath, index, array) => {
  return limit(async () => {
    // Introduce a delay to avoid overloading the download endpoint
    await wait(defaults.delay)
    return downloadImage(imagePath, index, array)
  })
})

await Promise.all(requests)

log('important', `downloaded ${distinctImagePathList.length} image files.`)
log('important', '✅ dlimg finished successfully!')
