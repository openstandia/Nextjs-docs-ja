# Next.js 公式ドキュメント 日本語翻訳プロジェクト

本プロジェクトは [Next.js 公式ドキュメント](https://nextjs.org/docs)の翻訳プロジェクトです。静的サイトツールの [Docusaurus](https://docusaurus.io/) を用いて作成されています。

## 翻訳手順について

翻訳対象のテキストは、リポジトリ内の `docs/app-router` 以下で管理されています。公式ドキュメントがアップデートされ次第本プロジェクトもそれに追随してアップデートを行う予定ですが、公式にて新しく追加されたページは本リポジトリで管理されていない場合があります。

翻訳者は `docs/app-router` フォルダ内のファイルに訳文を書いていくのが主なタスクとなります。以下、詳細な翻訳フローについて説明します。

## 事前準備

翻訳ファイルのフォーマットを統一するため、エディタは [Visual Studio Code](https://code.visualstudio.com/)、コードフォーマッターは [Prettier](https://prettier.io/) を使用することを前提としています。<br>そのため、翻訳者は Visual Studio Code を事前にインストールし、[Prettier プラグイン](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)を Visual Studio Code に導入してください。
コードフォーマットの定義については、[.prettierrc](https://github.com/openstandia/Nextjs-docs-ja/blob/main/.prettierrc) を参照ください。

今後、翻訳作業の効率化や用語の統一のため、ツールを導入することも検討しています。運用については決定次第本ページを更新しますので少々お待ちください。

## 翻訳フロー

1. どの範囲のドキュメントを翻訳するか明確にするための [Issue](https://github.com/openstandia/Nextjs-docs-ja/issues) を作成します。
   - Issue のテンプレートは [issue_template.md](https://github.com/openstandia/Nextjs-docs-ja/blob/main/.github/ISSUE_TEMPLATE/issue_template.md) を使用してください。
2. 本プロジェクトを `clone` し、1.で作成した Issue 番号を含んだブランチを作成します。ブランチ名は`feature/#<Issue番号>-<説明>`としてください。

   ```bash
   git clone https://github.com/openstandia/Nextjs-docs-ja.git
   cd Nextjs-docs-ja
   git checkout feature/#1-initial
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
6. プロジェクト管理者によってレビューが行われるため、指摘を受けた場合は適切に対応します。問題なければ承認され、[ホスティングサイト](https://ja.next-community-docs.dev/docs/app-router)に自動で反映されます。
   - **Pull Request の承認はプロジェクト管理者が行うため、翻訳者が勝手に承認しないでください。**

## 翻訳時の注意点

TBD...
