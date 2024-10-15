/**
 * @fileoverview
 * This script processes markdown (MDX) files by modifying code blocks.
 * It identifies code blocks with switcher functionality, wraps them in <Tabs> component,
 * and converts 'filename' attributes to 'title'.
 * Additionally, it updates files based on changes detected in a git diff.
 */

import path, { basename, dirname } from 'node:path'
import { fs } from 'zx'
import { createLogger, parseMdxDiff, MdxFilePath } from './utils.mts'
import { configs } from './configs.mts'
import { parseArgs } from 'node:util'

const defaults = {
  nextjsUrl: 'https://nextjs.org/',
  docsVersion: 'canary',
} as const

/**
 * Modifies the input string by replacing 'filename' attributes with 'title'
 * and wrapping code blocks with tabs for the switcher functionality.
 *
 * @param {string} input - The input string containing code blocks.
 * @returns {string} The modified input with switcher tabs.
 */
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
   * @param {object} params - The parameters for adding a tab item.
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
 * Replaces links in Markdown text based on specific conditions.
 *
 * This function modifies URLs to point to official documentation links
 * based on defined rules.
 *
 * @param {string} input - The Markdown text to be processed.
 * @returns {string} - The Markdown text with replaced links.
 *
 */
function modLinks(input: string): string {
  const defs: {
    condition: (url: string) => boolean
    replace: (url: string) => string
  }[] = [
    {
      condition: (url: string) => {
        return url.startsWith(`/${configs.docsDir}/pages`)
      },
      replace: (url: string) => {
        return new URL(
          path.join(
            configs.docsDir,
            defaults.docsVersion,
            url.replace(configs.docsDir, '')
          ),
          defaults.nextjsUrl
        ).toString()
      },
    },

    {
      condition: (url: string) => {
        return url.startsWith(`/${configs.docsDir}/messages/`)
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

const { projectRootDir } = configs
const log = createLogger(basename(import.meta.url))

log('important', '🚀 started to mod !')

const {
  positionals: [diffFilePath],
} = parseArgs({
  allowPositionals: true,
})

const mdPathList = await parseMdxDiff(
  path.isAbsolute(diffFilePath) ? diffFilePath : path.resolve(diffFilePath)
)

/**
 * Processes each markdown file in the diff and modifies the code blocks if necessary.
 */
const commands = mdPathList.map(async (diff) => {
  let filePath: MdxFilePath | undefined
  let content: Buffer | undefined
  const { status } = diff
  if (status === 'A' || status === 'M') {
    filePath = diff.filePath
    content = await fs.readFile(path.resolve(projectRootDir, filePath))
  }

  if (status === 'R') {
    filePath = diff.toPath
    content = await fs.readFile(path.resolve(projectRootDir, filePath))
  }

  if (!content || !filePath) {
    throw new Error(`Unsupported status: ${status}`)
  }

  const modifiedContent = modLinks(modCodeblock(content.toString()))
  const pathToWrite = path.resolve(projectRootDir, filePath)

  log('normal', `writing modified files to "${pathToWrite}"`)
  await fs.ensureDir(dirname(pathToWrite))
  await fs.writeFile(pathToWrite, modifiedContent)
})

await Promise.all(commands)

log('important', '✅ mod finished successfully!')
