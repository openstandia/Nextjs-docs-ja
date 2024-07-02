import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'
import chalk from 'chalk'

const apiKey = process.env.API_KEY
const changedFilesPath =
  'auto_translate/translate_files_path/translate_files_path.txt'

if (apiKey == undefined) {
  console.error(chalk.red('Please set the API_KEY environment variable'))
  process.exit(1)
}

const openai = new OpenAI({
  apiKey: apiKey,
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

const translateFile = async (filePath) => {
  try {
    // ファイルの内容を読み込む
    let file_content = fs.readFileSync(filePath, 'utf-8')
    const content = buildContent(file_content)

    // ChatGPT APIを使用して翻訳する
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content }],
      stream: false,
    })
    // 翻訳結果の取得
    const translatedContent = stream.choices[0]?.message.content || ''

    // 翻訳結果をファイルに上書きする
    fs.writeFileSync(filePath, translatedContent, 'utf-8')
    console.log(chalk.green(`Translated content written to: ${filePath}`))
  } catch (err) {
    console.error(
      chalk.red(`Error cat translating file ${filePath}:`, err.message)
    )
    console.error(err)
  }
}

async function main() {
  try {
    // translate_files_path.txt から翻訳対象ファイルのパスを読み取る
    const filePaths = fs
      .readFileSync(changedFilesPath, 'utf-8')
      .trim()
      .split('\n')

    // 各ファイルに対して翻訳処理を実行する
    for (const filePath of filePaths) {
      translateFile(filePath.trim())
    }

    // ファイル削除処理
    await unlink(changedFilesPath)
    console.log('ファイルが正常に削除されました')
  } catch (err) {
    console.error(
      chalk.red('Error reading translate_files_path.txt:', err.message)
    )
  }
}

main()
