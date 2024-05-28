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
# feature/auto-translateブランチの最新commitのshaを取得する
# response=$(curl -s -w "\n%{http_code}" --header "Authorization: token ${TOKEN}" "${DEFAULT_API_URL}/branches/${TARGET_BRANCH}")
# body=$(echo "$response" | head -n -1 | jq -r ".commit.sha")
# code=$(echo "$response" | tail -n 1)

# if [ "$code" = "200" ]; then
#   echo "取得sha ${body}"
# else
#   echo "取得失敗"
#   exit 1
# fi

# 取得したshaをもとにcommit差分を取得
response=$(curl -s -w "\n%{http_code}" -H "Accept: application/vnd.github+json" -H "Authorization: token  ${TOKEN}" -H "X-GitHub-Api-Version: 2022-11-28" "${DEFAULT_API_URL}/commits/${TARGET_BRANCH}")
echo "${response}"
body=$(echo "$response" | head -n -1 | sed 's/\\//g' | tr -d '[:cntrl:]' | jq -r ".files[].filename")
echo "${body}"
code=$(echo "$response" | tail -n 1)

if [ "$code" = "200" ]; then
  echo "取得file"
  echo "${body}"
else
  echo "取得失敗"
  exit 1
fi
