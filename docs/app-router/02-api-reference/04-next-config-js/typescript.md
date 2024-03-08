---
title: typescript
description: Next.jsでは、デフォルトでTypeScriptのエラーが報告されます。この動作を無効にする方法をこちらで学びましょう。
sidebar_position: 35
---

プロジェクトに TypeScript のエラーがあると、Next.js のプロダクション・ビルド（`next build`）に失敗します。

アプリケーションにエラーがあり、危険を伴っているとしてもプロダクションコードを生成させたい場合は、ビルトインの型チェックを無効にできます。

無効にした場合は、ビルドまたはデプロイのプロセスの一部として型チェックを実行していることを必ず確認してください。さもなければ非常に危険なオプションです。

`next.config.js`を開き、`typescript`の設定で`ignoreBuildErrors`オプションを有効にします：

```js title="next.config.js"
module.exports = {
  typescript: {
    // !! 注意 !!
    // 危険なことに、プロジェクトに型エラーがあっても、本番ビルドを正常に完了させることができる
    // !! 注意 !!
    ignoreBuildErrors: true,
  },
}
```
