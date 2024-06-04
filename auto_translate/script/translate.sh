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

#   # ChatGPT APIに送信するペイロードの作成
#   PAYLOAD=$(cat <<EOF
#   {
#     "model": "gpt-4",
#     "messages": [
#       {"role": "system", "content": "You are a translator."},
#       {"role": "user", "content": "以下のテキストを日本語に翻訳してください:\n\n$file_content"}
#     ]
#   }
# EOF
#   )

#   # APIリクエストを送信
#   RESPONSE=$(curl -s -X POST https://api.openai.com/v1/chat/completions \
#     -H "Authorization: Bearer $API_KEY" \
#     -H "Content-Type: application/json" \
#     -d "$PAYLOAD")

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
        "content": "翻訳例です。"
      },
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
  echo "APIレスポンス:"
  echo "$response" | jq -r '.choices[0].message.content'

  # 上書き内容
  over_write_content=$(echo "$response" | jq -r '.choices[0].message.content')
  echo "$over_write_content" > "$item"

  # 上書き後の内容確認
  echo ""
  echo "$item ファイルの上書き後の内容確認"
  cat "$item"
done