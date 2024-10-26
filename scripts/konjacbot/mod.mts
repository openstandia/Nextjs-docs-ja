/**
 * @fileoverview
 * This script processes Markdown (MDX) files by modifying code blocks, links, and headings.
 * It identifies code blocks with switcher functionality, wraps them in <Tabs> components,
 * converts 'filename' attributes to 'title', updates links to official documentation,
 * adds IDs to headings, and processes files based on changes detected in a git diff.
 */

import path, { basename, dirname } from 'node:path'
import { fs } from 'zx'
import { createLogger, parseDiffFile } from './utils.mts'
import { configs } from './configs.mts'
import { parseArgs } from 'node:util'
import { MdxFilePath } from './types.mts'

const defaults = {
  nextjsUrl: 'https://nextjs.org/',
  docsVersion: 'canary',
} as const

const { projectRootDir, docsDir } = configs

const log = createLogger(basename(import.meta.url))

function modCodeblock(input: string): string {
  return wrapSwitcherWithTabs(replaceFilenameWithTitle(input))
}

/**
 * Replaces 'filename' attributes in code blocks with 'title' attributes.
 *
 * @param {string} input - The input string to process.
 * @returns {string} The modified string with 'filename' attributes replaced by 'title'.
 */
function replaceFilenameWithTitle(input: string): string {
  return input.replace(
    /```([a-zA-Z0-9]+)\s+file[N|n]ame="([^"]+)"/g,
    '```$1 title="$2"'
  )
}

/**
 * Wraps code blocks that have the switcher functionality into <Tabs> and <TabItem> components.
 * Handles multiple consecutive code blocks with the same title and combines them into one set of tabs.
 *
 * @param {string} input - The input string containing code blocks with 'switcher'.
 * @returns {string} The input string with code blocks wrapped in <Tabs> and <TabItem> components.
 */
function wrapSwitcherWithTabs(input: string): string {
  const languageMap: { [key: string]: string } = {
    tsx: 'TypeScript',
    jsx: 'JavaScript',
    js: 'JavaScript',
    ts: 'TypeScript',
  }

  const regex =
    /^\s*```(?<language>[a-zA-Z0-9]+)\s+title="(?<title>[^"]+)"(?<highlightAttr>\s+highlight=[^\s]+)?\s+switcher(?<code>[\s\S]*?)^\s*```/gm

  let result = ''
  let lastIndex = 0
  let tabItems: string[] = []
  let currentTitle = ''

  // Find all code blocks in the input string using regex.
  const matches = [...input.matchAll(regex)]

  matches.forEach((match, index) => {
    // Append non-matching content before the current match.
    result += input.slice(lastIndex, match.index)

    const { language, title, code, highlightAttr } = getMatchGroups(match)
    if (language && title && code) {
      const label = languageMap[language] || language
      const titleWithoutExtension = title.replace(
        /\.[^\s\.]+$|\.[^\s\.]+\s/g,
        ''
      )

      if (currentTitle === titleWithoutExtension) {
        // Append a new tab item to the existing tabs if the title matches.
        addTabItem({
          tabItems,
          language,
          label,
          title,
          code,
          highlightAttr,
        })
      } else {
        // Close the previous set of tabs if there are any, and start a new one.
        result += closeTabs(tabItems)
        currentTitle = titleWithoutExtension
        addTabItem({
          tabItems,
          language,
          label,
          title,
          code,
          highlightAttr,
        })
      }
    }

    lastIndex = match.index! + match[0].length

    // If the next block is not consecutive, close the current tabs.
    const nextMatch = matches[index + 1]
    if (
      !nextMatch ||
      input.slice(lastIndex, nextMatch.index).trim().length > 0
    ) {
      result += closeTabs(tabItems)
      currentTitle = ''
    }
  })

  // Append remaining content after the last match.
  result += input.slice(lastIndex)

  return result

  /**
   * Extracts the language, title, code content, and highlight attribute from the match object.
   *
   * @param {RegExpMatchArray} match - The regex match object containing the code block details.
   * @returns {{ language: string, title: string, code: string, highlightAttr: string | undefined }} The extracted language, title, code, and optional highlight attribute.
   */
  function getMatchGroups(match: RegExpMatchArray) {
    return {
      language: match.groups?.language,
      title: match.groups?.title,
      code: match.groups?.code,
      highlightAttr: match.groups?.highlightAttr,
    }
  }

  /**
   * Adds a new <TabItem> component for the given code block.
   *
   * @param {Object} params - The parameters for adding a tab item.
   * @param {string[]} params.tabItems - The list of current tab items to append to.
   * @param {string} params.language - The programming language of the code block.
   * @param {string} params.label - The label to display for the tab (based on the language).
   * @param {string} params.title - The title of the code block.
   * @param {string} params.code - The actual code content of the block.
   * @param {string | undefined} params.highlightAttr - The highlight attribute, if any.
   */
  function addTabItem({
    tabItems,
    language,
    label,
    title,
    code,
    highlightAttr,
  }: {
    tabItems: string[]
    language: string
    label: string
    title: string
    code: string
    highlightAttr?: string
  }) {
    const highlight = highlightAttr ? ` ${highlightAttr.trim()}` : ''
    tabItems.push(
      `<TabItem value="${language}" label="${label}">\n\n\`\`\`${language} title="${title}"${highlight} switcher\n${code.trim()}\n\`\`\`\n</TabItem>`
    )
  }

  /**
   * Closes the current set of tabs and returns the formatted <Tabs> component.
   *
   * @param {string[]} tabItems - The current list of tab items.
   * @returns {string} The complete <Tabs> component or an empty string if there are no tab items.
   */
  function closeTabs(tabItems: string[]) {
    if (tabItems.length > 0) {
      const tabs = `<Tabs>\n${tabItems.join('\n')}\n</Tabs>\n`
      tabItems.length = 0 // Reset the list of tab items.
      return tabs
    }
    return ''
  }
}

/**
 * Replaces links in Markdown text to point to official documentation based on defined rules.
 *
 * @param {string} input - The Markdown text to be processed.
 * @returns {string} - The Markdown text with replaced links.
 */
function modLinks(input: string): string {
  const defs: {
    condition: (url: string) => boolean
    replace: (url: string) => string
  }[] = [
    {
      condition: (url: string) => {
        return url.startsWith(`/${docsDir}/pages`)
      },
      replace: (url: string) => {
        return new URL(
          path.join(docsDir, defaults.docsVersion, url.replace(docsDir, '')),
          defaults.nextjsUrl
        ).toString()
      },
    },

    {
      condition: (url: string) => {
        return url.startsWith(`/${docsDir}/messages/`)
      },
      replace: (url: string) => {
        return new URL(url, defaults.nextjsUrl).toString()
      },
    },

    {
      condition: (url: string) => {
        return (
          url.startsWith(`/learn/`) ||
          url.startsWith(`/blog/`) ||
          url === '/telemetry'
        )
      },
      replace: (url: string) => {
        return new URL(url, defaults.nextjsUrl).toString()
      },
    },
  ]

  const regex = /\[(.+?)\]\(([^)]+)\)/g

  return input.replace(regex, (match, linkText, url) => {
    let replacedUrl = undefined
    defs.forEach((d) => {
      if (d.condition(url)) {
        replacedUrl = d.replace(url)
        return
      }
    })

    return `[${linkText}](${replacedUrl ?? url})`
  })
}

/**
 * Modifies headings in the input string by adding IDs to them.
 *
 * @param {string} input - The input string containing headings.
 * @returns {string} The modified string with IDs added to the headings.
 */
function modHeadings(input: string): string {
  const headingRegex = /^(#{1,6})\s+(.*)$/gm

  return input.replace(headingRegex, (match, hashes, headingText) => {
    const id = headingText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    return `${hashes} ${headingText} {#${id}}`
  })
}

/**
 * Main function that processes the input Markdown string through various modifications.
 *
 * @param {string} input - The input Markdown string to be modified.
 * @returns {string} The modified Markdown string with code blocks, links, and headings adjusted.
 */
function mod(input: string): string {
  return modHeadings(modLinks(modCodeblock(input)))
}

log('important', '🚀 started to mod !')

const {
  positionals: [diffFilePath],
} = parseArgs({
  allowPositionals: true,
})

const { diffs: mdPathList } = await parseDiffFile(path.resolve(diffFilePath))

/**
 * Processes each Markdown file in the diff and modifies the content if necessary.
 * Handles different file statuses (Added, Modified, Renamed, Deleted) appropriately.
 */
const commands = mdPathList.map(async (diff) => {
  let filePath: MdxFilePath | undefined
  let content: Buffer | undefined
  const { status, score } = diff

  if (status === 'A' || status === 'M') {
    filePath = diff.filePath
    content = await fs.readFile(path.resolve(projectRootDir, filePath))
  }

  if (status === 'R') {
    if (score === 100) {
      log('normal', `skipping mod because this file is R100 : "${diff.toPath}"`)
      return
    }
    filePath = diff.toPath
    content = await fs.readFile(path.resolve(projectRootDir, filePath))
  }

  if (status === 'D') {
    log(
      'normal',
      `skipping mod because this file is deleted : "${diff.filePath}"`
    )
    return
  }

  if (!content || !filePath) {
    throw new Error(`Unsupported status: ${status}`)
  }

  const modifiedContent = mod(content.toString())
  const pathToWrite = path.resolve(projectRootDir, filePath)

  log('normal', `writing modified files to "${pathToWrite}"`)
  await fs.ensureDir(dirname(pathToWrite))
  await fs.writeFile(pathToWrite, modifiedContent)
})

await Promise.all(commands)

log('important', '✅ mod finished successfully!')
