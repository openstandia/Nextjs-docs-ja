---
title: distDir
description: デフォルトの .next ディレクトリの代わりにカスタムのビルドディレクトリを設定します。
sidebar_position: 6
---

`.next`の代わりに使用するビルドディレクトリの名前を指定できます。

`next.config.js`を開き、`distDir`の設定を追加します：

```js title="next.config.js"
module.exports = {
  distDir: 'build',
}
```

`next build`を実行すると、デフォルトの`.next`フォルダの代わりに`build`フォルダが使用されます。

> `distDir`はプロジェクト・ディレクトリの外に置いては**いけません**。例えば、`../build`は無効なディレクトリです。
