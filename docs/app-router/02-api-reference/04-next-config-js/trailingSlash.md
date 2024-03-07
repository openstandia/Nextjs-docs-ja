---
title: trailingSlash
description: Next.jsのページを設定して、末尾のスラッシュの有無に対応させます。
sidebar_position: 31
---

デフォルトでは、Next.js は末尾にスラッシュのある URL を、末尾にスラッシュのない URL にリダイレクトします。たとえば`/about/`は`/about`にリダイレクトされます。末尾にスラッシュのない URL は、末尾にスラッシュのある URL にリダイレクトされます。

`next.config.js`を開き、`trailingSlash`の設定を追加してください：

```js title="next.config.js"
module.exports = {
  trailingSlash: true,
}
```

このオプションを設定すると、`/about`のような URL は`/about/`にリダイレクトされます。

## バージョン履歴

| Version  | Changes                            |
| :------- | :--------------------------------- |
| `v9.5.0` | `trailingSlash` が追加されました。 |
