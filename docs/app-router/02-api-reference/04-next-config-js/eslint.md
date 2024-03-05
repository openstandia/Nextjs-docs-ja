---
title: eslint
description: デフォルトでは、Next.jsはビルド時にESLintのエラーと警告を報告します。この動作をオプトアウトする方法については、こちらを確認してください。
---

プロジェクトで ESLint が使用されていることが検出されると、Next.js はエラーがある場合に**プロダクション・ビルド**（`next build`）を失敗させます。

アプリケーションに ESLint エラーがあっても Next.js がプロダクションのコードを生成するようにしたい場合は、ビルドインのリントのステップを無効にできます。ただし、ワークフローの別の部分（たとえば CI や pre-commit フックなど）で ESLint を実行するように設定している場合は、この方法は推奨されません。

`next.config.js`を開き、`eslint`の`ignoreDuringBuilds`オプションを有効にしてください：

```js title="next.config.js"
module.exports = {
  eslint: {
    // 警告： プロジェクトに ESLint エラーがあったとしても、プロダクション環境でのビルドを成功させることができます。
    ignoreDuringBuilds: true,
  },
}
```
