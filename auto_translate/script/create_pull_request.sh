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
DEFAULT_API_URL="https://api.github.com/repos/openstandia/Nextjs-docs-ja"
TARGET_BRANCH="feature/pr-test"

CHANGED_FILES=$(cat auto_translate/translate_files_path/translate_files_path.txt)
if [ -z "$CHANGED_FILES" ]; then
  echo "ERROR: 変更されたファイルが確認できませんでした。"
  exit 1
fi

# 変更ファイルを箇条書き形式に変換
CHANGED_FILES_LIST=$(echo "$CHANGED_FILES" | sed 's/^/- /')

# タイムスタンプの取得
TIMESTAMP=$(TZ=Asia/Tokyo date +'%Y-%m-%d %H:%M:%S')

# 1. GitHub APIを使用してPRを作成する
# プルリクエストの内容を定義
PR_TITLE="Auto translate completed at ${TIMESTAMP}"
PR_BODY=$(cat <<EOF
## Description

自動翻訳が完了しました。
問題がないか確認お願いします。

## Changed Files

以下のファイルが変更されました:

${CHANGED_FILES_LIST}

EOF
)

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

status=$(tail -n1 <<< "$RESPONSE")

# ステータスが201でない場合はエラーとして処理
if [ "$status" -ne 201 ]; then
  echo "ERROR: PRの作成に失敗しました。ステータス:  $status"
  exit 1
fi

# 作成されたプルリクエストのURLを表示
echo "INFO: PRは以下に作成されました: $(echo "$RESPONSE" | jq -r .html_url)"

# レビュワー設定のためのAPI
PR_NUMBER=$(echo "$RESPONSE" | jq -r .number)
if [ "$PR_NUMBER" != "null" ]; then
  REVIEW_RESPONSE=$(curl -s -X POST -H "Authorization: token ${TOKEN}" \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    -d '{"reviewers":["kannoixia"]}' \
    "${DEFAULT_API_URL}/pulls/${PR_NUMBER}/requested_reviewers")

  echo "INFO: レビュワーが設定されました: $(echo "$REVIEW_RESPONSE" | jq -r '.requested_reviewers[0].login')"
else
  echo "ERROR: PR番号が取得できず、レビュワーを設定できませんでした。レスポンス: $RESPONSE"
  exit 1
fi