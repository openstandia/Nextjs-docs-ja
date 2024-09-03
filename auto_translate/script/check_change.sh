#!/bin/bash

################################################################################
#
# 名前：check_change.sh
#
# 機能：docs配下の変更を取得する
#     1. GitHub APIを使用してブランチ内の変更があったファイルを取得する
#     2. 変更があったファイルパスを外部ファイルに出力する
#
################################################################################

# 0. 環境設定
TOKEN=$1
TARGET_BRANCH=$2
DEFAULT_API_URL="https://api.github.com/repos/openstandia/Nextjs-docs-ja"

# 1. GitHub APIを使用してブランチ内の変更があったファイルを取得する
# ブランチの最新commitの変更ファイル名を取得
response=$(curl -s -w "\n%{http_code}" -H "Accept: application/vnd.github+json" -H "Authorization: token  ${TOKEN}" -H "X-GitHub-Api-Version: 2022-11-28" "${DEFAULT_API_URL}/commits/${TARGET_BRANCH}")
body=$(echo "$response" | head -n -1 | sed 's/\\//g' | tr -d '[:cntrl:]' | jq "[.files[] | select(.status != \"removed\") | { filename: .filename}]")
code=$(echo "$response" | tail -n 1)

target_file_num=$(echo "$body" | jq length)

if [ "$code" = "200" ]; then
  if [ "$target_file_num" -eq 0 ]; then
    echo "INFO: 追加、変更されたファイルはありません。"
    exit 1
  fi
  i=0
  translate_files_path=()
  echo "INFO: 翻訳対象ファイル"
  while [ $i -lt "$target_file_num" ]; do
        file_path="$(echo "$body" | jq -r ".[$i].filename")"
        printf "[%2d]: filename: %-40s \n" $((i + 1)) "$file_path"
        translate_files_path+=("$file_path")
        i=$((i + 1))
  done
else
  echo "取得失敗"
  exit 1
fi

# 2. 変更があったファイルパスを外部ファイルに出力する
# この後のジョブで使用できるようにtranslate_files_path配列をtxtファイルに書き出し
printf "%s\n" "${translate_files_path[@]}" > auto_translate/translate_files_path/translate_files_path.txt

echo "INFO: 変更ファイル取得ジョブの終了"