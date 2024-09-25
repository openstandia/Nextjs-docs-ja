import { $ } from 'zx'
import process from 'node:process'
import OpenAI from 'openai'
import * as path from 'node:path'
import { configs } from './configs.mts'
import { createLogger } from './utils.mts'
import { basename } from 'node:path'

/*
 * definitions
 */
const defaults = {
  apiKey: process.env.OPENAI_API_KEY,
  label: configs.botName,
  branchPrefix: `${configs.botName}/sync-nextjs-docs`,
  nextjs: {
    github: 'https://github.com/vercel/next.js',
    web: 'https://nextjs.org/docs',
  },
} as const

const log = createLogger(basename(import.meta.url))

async function buildNextJsGithubUrl() {
  const diff = (await $`git diff HEAD^ -- ${configs.submoduleName}`).text()
  const hash = {
    before: diff.match(/^-Subproject commit ([0-9a-zA-Z]+)$/m)?.[1],
    after: diff.match(/^\+Subproject commit ([0-9a-zA-Z]+)$/m)?.[1],
  }

  if (!hash.before || !hash.after) {
    throw Error('failed to resolve submodule commit diffs.')
  }

  const nextjsGithubBaseUrl = new URL(defaults.nextjs.github)
  const comparePath = path.join(
    nextjsGithubBaseUrl.pathname,
    `compare/${hash.before.substring(0, 7)}..${hash.after.substring(0, 7)}`
  )
  const treePath = path.join(nextjsGithubBaseUrl.pathname, `tree/${hash.after}`)

  const compareUrl = new URL(comparePath, nextjsGithubBaseUrl.origin).toString()
  const treeUrl = new URL(treePath, nextjsGithubBaseUrl.origin).toString()

  return {
    compare: {
      label: `${hash.before.substring(0, 7)}..${hash.after.substring(0, 7)}`,
      url: compareUrl,
    },
    tree: {
      label: `${hash.after}`,
      url: treeUrl,
    },
  }
}

/*
 * entry point
 */

log('important', '🚀 pr creation started !')

//変更が無かったらその時点で終了
const status = (await $`git status -s`).text()

if (!status.trim()) {
  log('important', '✅ No update found. exit without PR.')
  process.exit(0)
}

//ブランチ切ってpush
const submodule = (await $`git submodule`).text()
const hash = {
  short: submodule.trim().substring(0, 7),
  long: submodule.trim().substring(0, 40),
} as const
const branch = `${defaults.branchPrefix}-${hash.short}`

await $`git checkout -b ${branch}`
await $`git add .`
await $`git commit -a -m "translate next.js @ ${hash.short} into Japanese."`
await $`git push origin ${branch}`

const diff = (await $`git diff HEAD^`).text()
const openai = new OpenAI({
  apiKey: defaults.apiKey,
})

const result = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'system',
      content:
        'これから入力する内容は、Gitリポジトリのdiffコマンドの実行結果です。変更内容の要約を作成してください。',
    },
    { role: 'user', content: diff },
  ],
  stream: false,
})

if (result.choices.length !== 1) {
  throw new Error(
    `invalid OpenAI translation result: ${JSON.stringify(result)}`
  )
}
const diffSummary = result.choices[0].message.content

//PR作成
//TODO 既にPRが出ている場合の考慮
const nextjsGitHubUrl = await buildNextJsGithubUrl()

const title = `${configs.botName}: translated Next.js docs @ ${hash.short} into Japanese`
const body = `
# 翻訳した公式ドキュメントバージョン
[${nextjsGitHubUrl.tree.label}](${nextjsGitHubUrl.tree.url})

# 翻訳した公式ドキュメントの変更点
[${nextjsGitHubUrl.compare.label}](${nextjsGitHubUrl.compare.url})

# 本PRの更新内容のサマリ by ChatGPT🤖
${diffSummary}
`
await $`gh pr create -B main -t ${title} -b ${body} -l ${defaults.label}`

log('important', '✅ PR created successfully !')
