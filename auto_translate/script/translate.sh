#!/bin/bash

################################################################################
#
# 名前：translate.sh
#
# 機能：変更があったファイルの内容を取得して翻訳する
#     1. translate_files_path.txtの内容を取得して翻訳対象ファイルの内容を取得する
#     2. 翻訳対象ファイルの内容をChatGPTのAPIをたたいて翻訳してもらう
#     3. 翻訳内容を上書きする
#
################################################################################

# 0. 環境設定

# 1. translate_files_path.txtの内容を取得して翻訳対象ファイルの内容を取得する
# ファイルから配列を読み込む
translate_files_path=()
while IFS= read -r line; do
  translate_files_path+=("$line")
done < auto_translate/script/translate_files_path/translate_files_path.txt

for item in "${translate_files_path[@]}"; do
  # 2. 翻訳対象ファイルの内容をChatGPTのAPIをたたいて翻訳してもらう
  # ファイルごとAPIで送信できる？？→できなさそうなのでファイルの内容を読み取ってテキストデータで送信
  file_content=$(cat "$item")

  # テスト出力
  echo "$item ファイルの内容"
  echo "$file_content"
  echo ""

# REQUEST_DATA=$(jq -n \
#   --arg text "$file_content" \
#   '{
#     "model": "gpt-4",
#     "messages": [
#       {
#         "role": "system",
#         "content": "Translate the following text to Japanese."
#       },
#       {
#         "role": "user",
#         "content": $text
#       }
#     ]
#   }')

#   # APIリクエストを送信
#   RESPONSE=$(curl -s -X POST https://api.openai.com/v1/chat/completions \
#     -H "Authorization: Bearer $API_KEY" \
#     -H "Content-Type: application/json" \
#     -d "$REQUEST_DATA")

  # 仮のAPIレスポンス
  response='{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-4-0314",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "---\ntitle: App Router\ndescription: Layouts、Server Components、Suspenseなど、Next.js と React の最新機能を備えた新しい App Router をご利用ください。\n---\n\n:::caution\n本ドキュメントは[公式ドキュメント](https://nextjs.org/docs)の [v14.1.0](https://github.com/vercel/next.js/tree/v14.1.0/docs) の断面を翻訳したものです。Next.js の公式 X アカウントにも[ポスト](https://twitter.com/nextjs/status/1746921179879735677)頂きました。\n\n[公式ドキュメント](https://nextjs.org/docs)のアップデートに追随して適宜更新しますが、最新情報が反映できていない可能性があります。\n\n一部翻訳途中のページがありますが、随時翻訳を追加予定です。\n:::\n\nNext.js の App Router は、React の最新機能を使ってアプリケーションを構築するための新しい方法です。すでに Next.js に慣れ親しんでいる方であれば、App Router が既存のファイルシステムベースのルーターである [Pages Router](https://nextjs.org/docs/pages) の自然な進化形であることがわかるでしょう。\n\n新しいアプリケーションには、App Router の使用をお勧めします。既存のアプリケーションについては、[段階的に App Router に移行できます](/docs/app-router/building-your-application/upgrading/app-router-migration)。同じアプリケーションで両方のルーターを使用することも可能です。\n\nこのセクションでは、App Router で利用可能な機能について説明します。"      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 9,
    "completion_tokens": 12,
    "total_tokens": 21
  }
}'
  # レスポンスを表示
  # echo "APIレスポンス:"
  # echo "$response" | jq -r '.choices[0].message.content'

  # 上書き内容
  over_write_content=$(echo "$response" | jq -r '.choices[0].message.content')
  echo "$over_write_content" > "$item"

  # 上書き後の内容確認
  echo ""
  echo "$item ファイルの上書き後の内容確認"
  cat "$item"
done