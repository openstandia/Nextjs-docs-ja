---
title: devIndicators
description: 最適化されたページには、静的に最適化されているかどうかを知らせるインジケータがあります。ここでオプトアウトすることもできます。
---

コードを編集して Next.js がアプリケーションをコンパイルしているとき、ページの右下にコンパイルインジケータが表示されます。

> **Good to know**: このインジケータは開発モードでのみ表示され、プロダクションモードでアプリをビルドして実行するときには表示されません。

<!-- textlint-disable -->

場合によっては、このインジケーターがチャット・ランチャーと競合するなど、ページ上で誤った位置に表示されることがあります。位置を変更するには、`next.config.js`を開き、`devIndicators`の`buildActivityPosition`を`bottom-right`（デフォルト）、`bottom-left`、`top-right`、`top-left`に設定してください：

<!-- textlint-enable -->

```js title="next.config.js"
module.exports = {
  devIndicators: {
    buildActivityPosition: 'bottom-right',
  },
}
```

場合によっては、このインジケーターは役に立たないかもしれません。削除するには、`next.config.js`を開き、`devIndicators`オブジェクトの`buildActivity`設定を無効にします：

```js title="next.config.js"
module.exports = {
  devIndicators: {
    buildActivity: false,
  },
}
```
