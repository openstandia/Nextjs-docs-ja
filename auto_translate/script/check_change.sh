#!/bin/bash

################################################################################
#
# 名前：check_change.sh
#
# 機能：docs配下の変更を取得する
#     1. github apiを使用してfeature/auto-translateブランチの変更があったファイルを取得する
#     2. 変更があったファイルを参照して内容を取得する 
#
# 設定：autotranslate/config/.envを参照して、適切な値を設定すること。
#
################################################################################

# 0. 環境設定
TOKEN=$1
DEFAULT_API_URL="https://api.github.com/repos/openstandia/Nextjs-docs-ja"
TARGET_BRANCH="feature/auto-translate"

# 1. github apiを使用してfeature/auto-translateブランチの変更があったファイルを取得する
# ブランチの最新commitの変更ファイル名を取得
response=$(curl -s -w "\n%{http_code}" -H "Accept: application/vnd.github+json" -H "Authorization: token  ${TOKEN}" -H "X-GitHub-Api-Version: 2022-11-28" "${DEFAULT_API_URL}/commits/${TARGET_BRANCH}")
body=$(echo "$response" | head -n -1 | sed 's/\\//g' | tr -d '[:cntrl:]' | jq "[.files[] | select(.status != \"removed\") | { filename: .filename}]")
code=$(echo "$response" | tail -n 1)

target_file_num=$(echo "$body" | jq length)

if [ "$code" = "200" ]; then
  if [ "$target_file_num" -eq 0 ]; then
      echo "追加、変更されたファイルはありません。"
      exit 1
  fi
  for((i = 0; i < target_file_num ; i++)); do
        printf "[%2d]: filename: %-40s \n" $((i + 1)) "$(echo "$body" | jq ".[$i].filename")"
  done
else
  echo "取得失敗"
  exit 1
fi
