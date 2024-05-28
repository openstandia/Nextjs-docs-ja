#!/bin/bash

################################################################################
#
# 名前：check_change.sh
#
# 機能：docs配下の変更を取得する
#     1. github apiを使用してfeature/translate-docsブランチの変更があったファイルを取得する
#     2. 変更があったファイルを参照して内容を取得する 
#
# 設定：autotranslate/config/.envを参照して、適切な値を設定すること。
#
################################################################################

# 0. 環境設定
TOKEN=$1
shell_dir="$(cd "$(dirname "$0")" && pwd)"
config_dir="${shell_dir}/../config"
# shellcheck source=/dev/null
source "${config_dir}"/.env

# 1. github apiを使用してfeature/translate-docsブランチの変更があったファイルを取得する
result=$(curl -s -w "\n%{http_code}" --header "Authorization: token ${TOKEN}" "https://api.github.com/repos/openstandia/Nextjs-docs-ja/issues" | jq)
echo "Hello Github Actions"
echo "$result"