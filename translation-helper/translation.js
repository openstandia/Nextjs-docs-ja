import OpenAI from 'openai'
import inquirer from 'inquirer'
import editor from '@inquirer/editor'
import chalk from 'chalk'
import ncp from 'copy-paste'

if (process.env.OPENAI_API_KEY == undefined) {
  console.error(chalk.red('Please set the OPENAI_API_KEY environment variable'))
  process.exit(1)
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const buildContent = (content) => {
  return `
# 質問文

以下の文章はNext.jsに関するテキストです。
この記事を「条件」のセクションの項目に従って日本語に翻訳してください。なお、入力はマークダウン形式で、出力はマークダウン形式を維持します。
例えばリンク、コードブロックもマークダウンで出力してください。

${content}

# 条件

- 文章はWebアプリケーション開発に関するものです。Webアプリケーションの文脈で翻訳してください
- コードブロックに付随する「filename=」は「title=」に置換してください
- コードブロック内のコードは翻訳せず、コメント部分だけ翻訳してください
- リストの末尾の句読点は省きます
- テーブル内の文章の末尾の句読点は省きます
- 文末のセミコロンは全角に変換してください
- text-lint の"preset-bengo4"のルールに沿った文章に翻訳してください
- リンクのパスが「/docs/app」から始まる場合、「/docs/app-router」に置き換えてください
- 「Good to know」は訳さずにそのまま出力してください
- 「Version History」は「バージョン履歴」に翻訳してください
- <PagesOnly></PagesOnly>で囲まれた部分は取り除いてください

# 出力フォーマット

マークダウン形式
`
}

function copyToPasteboard(text) {
  // const proc = spawn('pbcopy')
  // proc.stdin.write(text, 'utf8')
  // await new Promise((r) => proc.stdin.end(r))
  ncp.copy(text, () => {
    process.stdout.write('copy to pasteboard!\n')
  })
}

const writeLineBreak = (num = 1) => {
  process.stdout.write(Array(num).fill('\n').join(''))
}

async function main() {
  const answer = await editor({
    message: 'Enter document',
  })

  const content = buildContent(answer)

  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content }],
      stream: false,
    })

    writeLineBreak()
    const result = stream.choices[0]?.message.content || ''
    process.stdout.write(chalk.green(result))
    writeLineBreak(2)

    copyToPasteboard(result)
  } catch (err) {
    console.error(err)
  }
}

main()
