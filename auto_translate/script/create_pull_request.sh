#!/bin/bash

################################################################################
#
# 名前：create_pull_request.sh
#
# 機能：PRを作成する
#     1. GitHub APIを使用してPRを作成する
#
################################################################################

# 0. 環境設定
TOKEN=$1
SOURCE_BRANCH=$2
CHANGED_FILES=$3
DEFAULT_API_URL="https://api.github.com/repos/openstandia/Nextjs-docs-ja"
TARGET_BRANCH="feature/pr-test"


# 変更ファイルを箇条書き形式に変換
CHANGED_FILES_LIST=$(echo "$CHANGED_FILES" | sed 's/^/- /' | sed 's/ /\'$'\n- /g')

# タイムスタンプの取得
TIMESTAMP=$(date +'%Y-%m-%d %H:%M:%S')

# 1. GitHub APIを使用してPRを作成する
# プルリクエストの内容を定義
PR_TITLE="Auto translate completed at ${TIMESTAMP}"
PR_BODY="自動翻訳が完了しました。以下のファイルが変更されました:\n${CHANGED_FILES_LIST}\n\n問題がないか確認お願いします。"


# プルリクエストのデータをJSON形式で構築
PR_DATA=$(jq -n \
  --arg title "$PR_TITLE" \
  --arg body "$PR_BODY" \
  --arg head "$SOURCE_BRANCH" \
  --arg base "$TARGET_BRANCH" \
  '{title: $title, body: $body, head: $head, base: $base}')

# GitHub APIを使用してプルリクエストを作成
RESPONSE=$(curl -s -X POST -H "Authorization: token ${TOKEN}" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  -d "$PR_DATA" \
  "${DEFAULT_API_URL}/pulls")

# 作成されたプルリクエストのURLを表示
echo "Pull Request created: $(echo "$RESPONSE" | jq -r .html_url)"

