/**
 * @fileoverview This script automates the creation of a pull request with translated Next.js documentation.
 * It detects changes via git diffs, utilizes OpenAI for summary generation, and leverages GitHub CLI for PR creation.
 */

import { $ } from 'zx'
import process from 'node:process'
import OpenAI from 'openai'
import * as path from 'node:path'
import { configs } from './configs.mts'
import { createLogger } from './utils.mts'
import { basename } from 'node:path'

const defaults = {
  apiKey: process.env.OPENAI_API_KEY,
  enableAISummary: false, // TODO: 運用が始まったらtrueに
  label: configs.botName,
  branchPrefix: `${configs.botName}/sync-nextjs-docs`,
  nextjs: {
    github: 'https://github.com/vercel/next.js',
    web: 'https://nextjs.org/docs',
  },
} as const

const log = createLogger(basename(import.meta.url))

/**
 * Builds GitHub URLs for comparing commits on the Next.js repository.
 *
 * @param {string} diff - The git diff output.
 * @returns {{compare: {label: string, url: string}, tree: {label: string, url: string}}} Object containing comparison and tree URLs.
 * @throws Will throw an error if it fails to extract commit hashes from the diff.
 */
function buildNextJsGithubUrl(diff: string): {
  compare: { label: string; url: string }
  tree: { label: string; url: string }
} {
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

/**
 * Uses OpenAI API to create a summary of the given git diff.
 *
 * @param {string} diff - The git diff output.
 * @returns {Promise<string>} A promise resolving to a summary of the changes.
 * @throws Will throw an error for invalid OpenAI translation results.
 */
async function buildAISummary(diff: string): Promise<string> {
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
  const content = result.choices[0].message.content

  return `# 本PRの更新内容のサマリ by ChatGPT🤖\n  ${content}\n`
}

log('important', '🚀 pr creation started !')

const status = (await $`git status -s`).text()

if (!status.trim()) {
  log('important', '✅ No update found. exit without PR.')
  process.exit(0)
}

const submodule = (await $`git submodule`).text()

const submoduleHash = submodule.match(/[0-9a-z]{40}/)
if (submoduleHash == null || submoduleHash.length !== 1) {
  throw Error('failed to resolve submodule hash.')
}

const hash = {
  short: submoduleHash[0].substring(0, 7),
  long: submoduleHash[0].substring(0, 40),
} as const

// TODO: 既にPRやブランチが存在するケースの考慮

const branch = `${defaults.branchPrefix}-${hash.short}`

await $`git checkout -b ${branch}`
await $`git add .`
await $`git commit -a -m "translate next.js @ ${hash.short} into Japanese."`
await $`git push origin ${branch}`

const title = `${configs.botName}: translated Next.js docs @ ${hash.short} into Japanese`

const nextjsGitHubUrl = buildNextJsGithubUrl(
  (await $`git diff HEAD^ -- ${configs.submoduleName}`).text()
)

const body = `
# 翻訳した公式ドキュメントバージョン
[${nextjsGitHubUrl.tree.label}](${nextjsGitHubUrl.tree.url})

# 翻訳した公式ドキュメントの変更点
[${nextjsGitHubUrl.compare.label}](${nextjsGitHubUrl.compare.url})

${
  defaults.enableAISummary
    ? await buildAISummary((await $`git diff HEAD^`).text())
    : ''
}`

await $`gh pr create -B main -t ${title} -b ${body} -l ${defaults.label}`

log('important', '✅ PR created successfully !')
