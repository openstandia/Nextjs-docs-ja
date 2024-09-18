#!/bin/bash

if [ "$#" -ne 1 ]; then
  cat << _EOT_

  Usage:
    $0 <output_file_name>

  Parameter:
    output_file_name: 差分一覧を出力するファイル名(e.g.: .diff-docs.txt)

  Description:
    サブモジュールで参照している next.jsリポジトリを最新化した後、
    next.jsリポジトリの"docs"配下の差分を検知し、差分のファイルパス一覧を引数に指定したファイルに出力します。

    ファイルには、"diff --name-status" の実行結果を出力します。

    (出力例)
    M       docs/app-router/index.md
    D       docs/app-router/00-getting-started/02-project-structure.md


    差分が無い場合（submoduleが最新、docs以外には差分があるがdocsには無い等）は空ファイルを出力します。

_EOT_

  exit 1
fi

readonly script_name=${0##*/}
readonly output_file_name="$1"
readonly submodule_path='next.js'
trace () {
  echo -e "\e[36m$1 : \e[m"
  echo "$2"
  echo ''
}

echo -e "\e[32m🚀$script_name started!\e[m"

git submodule update --remote
readonly diff_output=$(git diff -- $submodule_path)
trace 'git diff' "$diff_output"

if [ -n "$diff_output" ]; then

    readonly hash_before=$(echo "$diff_output" | grep '^-Subproject' | sed 's/-Subproject commit //' | tr -d '[:space:]')
    readonly hash_after=$(echo "$diff_output" | grep '^+Subproject' | sed 's/+Subproject commit //' | tr -d '[:space:]')
    trace 'submodule hash' "$hash_before..$hash_after"

    submodule_diff_output=$(git submodule foreach git diff -M100% --name-status $hash_before..$hash_after -- docs \
                          | grep -v '^Entering*')

    echo "$submodule_diff_output" > "$output_file_name"
    trace "$output_file_name" "$submodule_diff_output"

else

    echo 'submodule is up to date, diff not found.'
    > "$output_file_name"

fi

echo -e "\e[32m🎉$script_name finished successfully!\e[m"
