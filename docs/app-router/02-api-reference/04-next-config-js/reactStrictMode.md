---
title: reactStrictMode
description: Next.js の完全なランタイムは Strict Mode に対応しました。オプトイン方法を学びます。
sidebar_position: 26
---

> **Good to know**: Next.js 13.4 以降、アプリルーターではデフォルトで Strict Mode が`true`になっているので、この設定は`pages`に対してのみ必要です。`reactStrictMode: false`を設定することで、Strict Mode を無効にすることができます。

> **推奨**: 将来の React への対応のため、Next.js アプリケーションで Strict Mode を有効にすることを強くお勧めします。

React の[Strict Mode](https://ja.react.dev/reference/react/StrictMode)は、アプリケーションの潜在的な問題をハイライトするための開発モード専用の機能です。安全でないライフサイクル、レガシー API の使用、その他多くの機能を特定するのに役立ちます。

Next.js ランタイムは Strict Mode に準拠しています。Strict Mode にオプトインするには、`next.config.js`で次のオプションを設定してください：

```js title="next.config.js"
module.exports = {
  reactStrictMode: true,
}
```

もしあなたやあなたのチームが、アプリケーション全体で Strict Mode を使う準備ができていなくても、大丈夫です！`<React.StrictMode>`を使って、ページごとに段階的に移行できます。
