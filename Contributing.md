# Next.js 公式ドキュメント 日本語翻訳プロジェクト

本プロジェクトは [Next.js 公式ドキュメント](https://nextjs.org/docs)の翻訳プロジェクトです。静的サイトツールの [Docusaurus](https://docusaurus.io/) を用いて作成されています。

## 翻訳手順について

翻訳対象のテキストは、リポジトリ内の `docs/app-router` 以下で管理されています。公式ドキュメントがアップデートされ次第本プロジェクトもそれに追随してアップデートを行う予定ですが、公式にて新しく追加されたページは本リポジトリで管理されていない場合があります。

翻訳者は `docs/app-router` フォルダ内のファイルに訳文を書いていくのが主なタスクとなります。以下、詳細な翻訳フローについて説明します。

## 事前準備

翻訳ファイルのフォーマットを統一するため、エディタは [Visual Studio Code](https://code.visualstudio.com/)、コードフォーマッターは [Prettier](https://prettier.io/) を使用することを前提としています。<br>そのため、翻訳者は Visual Studio Code を事前にインストールし、[Prettier プラグイン](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)を Visual Studio Code に導入してください。
コードフォーマットの定義については、[.prettierrc](https://github.com/openstandia/Nextjs-docs-ja/blob/main/.prettierrc) を参照ください。

今後、翻訳作業の効率化や用語の統一のため、ツールを導入することも検討しています。運用については決定次第本ページを更新しますので少々お待ちください。

## 各種ルール

### ブランチ戦略

ブランチ戦略は[GitHub Flow](https://docs.github.com/ja/get-started/using-github/github-flow)に則り、`main`, `feature`ブランチを利用します。

### ブランチネーミングルール

ブランチのネーミングは、以下のとおりです。

```text
フォーマット

<BranchType>/<IssueId>-<Subject>

e.g.
feature/#12345-add-docs

該当する<IssueId>がない場合省略OKです。
```

| 属性       | 説明                                                       |
| ---------- | ---------------------------------------------------------- |
| BranchType | ブランチ戦略に基づいて、feature ブランチタイプを記載します |
| IssueId    | そのテーマに紐づいた Issue ID を記載します                 |
| Subject    | ブランチで対応するテーマについての補足を記載します         |

<PageBreak />

### コミットコメントルール

[Semantic Commit Message](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716)をベースに英語表記を基本とします。

```text
フォーマット

<Type>:  <Subject> <Issue ID>

e.g.
feat: add docs `#177481`
```

#### Type

| Type     | 説明                                             |
| -------- | ------------------------------------------------ |
| feat     | ユーザー向けの機能の追加や変更                   |
| fix      | ユーザー向けの不具合の修正                       |
| docs     | ドキュメントの更新                               |
| style    | フォーマットなどのスタイルに関する修正           |
| refactor | リファクタリングを目的とした修正                 |
| test     | テストコードの追加や修正                         |
| chore    | タスクファイルなどプロダクションに影響のない修正 |

### PRのラベル

MR の内容を管理・検索しやすくするため、適切なラベルを付与します。

複数のラベルを付与して OK です。

| 属性          | 説明                                              |
| ------------- | ------------------------------------------------- |
| bug           | バグ・バグ修正                                    |
| CI/CD         | CI/CD 定義、Dockerfile の修正                     |
| chore         | typo の修正やライブラリアップデートなど軽微な修正 |
| documentation | ドキュメントの作成・修正                          |
| enhancement   | 機能追加                                          |
| konjacbot     | konjacbot 関連の修正                              |
| Operation     | 運用にまつわる修正                                |
| SEO           | SEO 対策にまつわる修正                            |
| Test          | ソース本体修正しない、テストコードの追加・修正    |

## 翻訳フロー

1. どの範囲のドキュメントを翻訳するか明確にするための [Issue](https://github.com/openstandia/Nextjs-docs-ja/issues) を作成します。
   - Issue のテンプレートは [issue_template.md](https://github.com/openstandia/Nextjs-docs-ja/blob/main/.github/ISSUE_TEMPLATE/issue_template.md) を使用してください。
2. 本プロジェクトを `clone` し、1.で作成した Issue 番号を含んだブランチを作成します。ブランチ名は`feature/#<Issue番号>-<説明>`としてください。

   ```bash
   git clone https://github.com/openstandia/Nextjs-docs-ja.git
   cd Nextjs-docs-ja
   git checkout -b feature/#1-initial
   ```

3. [Next.js 公式ドキュメント](https://nextjs.org/docs)から翻訳するドキュメントを選定し、本プロジェクトに該当するファイルを編集します。
   - 公式ドキュメントのソースコードは [vercel/next.js](https://github.com/vercel/next.js/tree/canary/docs) を参考にしてください。
   - ドキュメントに挿入する画像（SVG）については `docs/assets` 以下から取得してください。公式にて新しく追加されたページ等で、画像が見つからない場合は [Issue](https://github.com/openstandia/Nextjs-docs-ja/issues) に詳細を記載してください。
4. 翻訳が完了次第、リポジトリに push します。コミットメッセージはできるだけ理解しやすいものとしてください。

   ```bash
   git add <翻訳したファイル>
   git commit -m <コミットメッセージ>
   git push origin <2.で作成したブランチ名>
   ```

5. 2.で作成したブランチ名から `main` ブランチに向かって [Pull Request](https://github.com/openstandia/Nextjs-docs-ja/pulls) を作成します。
   - 内容に `Closes #<Issue番号>`を含めることで Pull Request と 1.で作成した Issue を適切に紐づけてください。
   - 適切にラベルを付与してください。
6. プロジェクト管理者によってレビューが行われるため、指摘を受けた場合は適切に対応します。問題なければ承認され、[ホスティングサイト](https://ja.next-community-docs.dev/docs/app-router)に自動で反映されます。
   - **Pull Request の承認はプロジェクト管理者が行うため、翻訳者が勝手に承認しないでください。**

## お問い合わせ

質問がある場合は、[unijs-nextjs@nri.co.jp](mailto:unijs-nextjs@nri.co.jp) までお問い合わせください。
