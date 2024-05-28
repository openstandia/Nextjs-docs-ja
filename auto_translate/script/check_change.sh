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
echo "環境調査"
pwd
ls -l
# shellcheck source=/dev/null
source auto_translate/config/.env

# 1. github apiを使用してfeature/auto-translateブランチの変更があったファイルを取得する
# feature/auto-translateブランチの最新commitのshaを取得する
response=$(curl -s -w "\n%{http_code}" --header "Authorization: token ${TOKEN}" "${DEFAULT_API_URL}/branches/${TARGET_BRANCH}")
body=$(echo "$response" | head -n -1 | jq -r ".commit.sha")
code=$(echo "$response" | tail -n 1)

if [ "$code" = "200" ]; then
  echo "取得sha ${body}"
else
  echo "取得失敗"
  exit 1
fi

# 取得したshaをもとにcommit差分を取得
response=$(curl -s -w "\n%{http_code}" --header "Authorization: token ${TOKEN}" "${DEFAULT_API_URL}/commits/${body}")
body=$(echo "$response" | head -n -1 | jq -r "files[].filename")
code=$(echo "$response" | tail -n 1)

if [ "$code" = "200" ]; then
  echo "取得file"
  echo "${body}"
else
  echo "取得失敗"
  exit 1
fi
echo "pwd"
pwd
echo "ls -l"
ls -l 