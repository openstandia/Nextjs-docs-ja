/**
 * @fileoverview This script automates the creation of a pull request with translated Next.js documentation.
 * It detects changes via git diffs, utilizes OpenAI for summary generation, and leverages GitHub CLI for PR creation.
 */

import { $ } from 'zx'
import { parseArgs } from 'node:util'
import process from 'node:process'
import path, { basename } from 'node:path'
import OpenAI from 'openai'
import { configs } from './configs.mts'
import {
  createOpenAIClient,
  createLogger,
  DiffFile,
  parseDiffFile,
  getCurrentDateTimeString,
} from './utils.mts'

const defaults = {
  apiKey: process.env.OPENAI_API_KEY,
  label: configs.botName,
  branchPrefix: `${configs.botName}/sync_docs`,
  nextjs: {
    github: 'https://github.com/vercel/next.js',
    web: 'https://nextjs.org/docs',
  },
} as const

$.verbose = true

const log = createLogger(basename(import.meta.url))

/**
 * Generates a markdown link to the specific version of the Next.js repository on GitHub.
 *
 * @param {Object} param - The parameter object.
 * @param {string} param.current - The current hash of the version.
 * @returns {string} A markdown string containing a link to the specific version of the repository.
 */
function buildVersionContent({ current }: DiffFile['hash']): string {
  const nextjsGithubBaseUrl = new URL(defaults.nextjs.github)

  const treePath = path.join(nextjsGithubBaseUrl.pathname, `tree/${current}`)
  const treeUrl = new URL(treePath, nextjsGithubBaseUrl.origin).toString()

  return `[${current.substring(0, 7)}](${treeUrl})`
}

/**
 * Builds a comparison URL for the given commit hashes.
 *
 * @param {Object} params - The parameters for the function.
 * @param {string} params.current - The current commit hash.
 * @param {string} params.previous - The previous commit hash.
 * @returns {string | undefined} A markdown link to the comparison URL if the previous hash is provided, otherwise undefined.
 */
function buildCompareContent({
  current,
  previous,
}: DiffFile['hash']): string | undefined {
  if (!previous) {
    return undefined
  }

  const nextjsGithubBaseUrl = new URL(defaults.nextjs.github)

  const commitHash = `${previous.substring(0, 7)}..${current.substring(0, 7)}`

  const comparePath = path.join(
    nextjsGithubBaseUrl.pathname,
    `compare/${previous}..${current}`
  )

  const compareUrl = new URL(comparePath, nextjsGithubBaseUrl.origin).toString()

  return `[${commitHash}](${compareUrl})`
}

/**
 * Generates a summary of the changes in the current Git repository.
 *
 * This function retrieves the diff of the current HEAD with its previous commit,
 * sends the diff to an OpenAI client to generate a summary, and returns the summary as a string.
 *
 * @returns {Promise<string>} A promise that resolves to the summary of the changes.
 */
async function buildPRSummary(): Promise<string> {
  const diff = (await $`git diff HEAD^`).text()

  const requestAI = createOpenAIClient(
    new OpenAI({
      apiKey: defaults.apiKey,
    })
  )

  const result = await requestAI({
    system:
      'これから入力する内容は、Gitリポジトリのdiffコマンドの実行結果です。変更内容の要約を日本語で作成してください。',
    user: diff,
  })

  return result
}

log('important', '🚀 pr creation started !')

const {
  positionals: [diffFilePath],
  values: { dryRun },
} = parseArgs({
  allowPositionals: true,
  options: {
    dryRun: {
      short: 'd',
      type: 'boolean',
      default: false,
    },
  },
})

const status = (await $`git status -s`).text()

if (!status.trim()) {
  log('important', '✅ No update found. exit without PR.')
  process.exit(0)
}

const { hash, diffs } = await parseDiffFile(
  path.isAbsolute(diffFilePath) ? diffFilePath : path.resolve(diffFilePath),
  { rawDiff: true }
)

const currentHash = {
  short: hash.current.substring(0, 7),
  full: hash.current,
}

// TODO: 既にPRやブランチが存在するケースの考慮

const branch = `${defaults.branchPrefix}_${currentHash.short}-${getCurrentDateTimeString()}`

await $`git checkout -b ${branch}`
await $`git add .`
await $`git commit -a -m "sync docs@${currentHash.short}"`
await $`git push origin ${branch}`

const title = `${configs.botName}: sync docs@${currentHash.short}`

const body = `
このPRは[Next.js](${defaults.nextjs.github})のドキュメントを翻訳したものです。

### Next.jsリポジトリのバージョン

${buildVersionContent(hash)}


### 本PRで取り込んだNext.jsの差分

${buildCompareContent(hash) ?? '差分更新ではなく、全てのドキュメントを翻訳しなおしました'}


### 翻訳したファイル一覧（計：${diffs.length} ファイル）

<details>
<summary>翻訳したファイル一覧を見るには展開してください</summary>

\`\`\`txt
${diffs.reduce((prev, current, index) => {
  return `${prev}${index === 0 ? '' : '\n'}${current}`
}, '')}
\`\`\`

</details>


### 本PRの更新内容のサマリ by OpenAI🤖

${await buildPRSummary()}


`

log('normal', `PR title: ${title}`)
log('normal', `PR body:\n${body}`)
log('normal', `PR label:${defaults.label}`)

if (!dryRun) {
  await $`gh pr create -t ${title} -b ${body} -l ${defaults.label}`
}

log('important', '✅ PR created successfully !')
