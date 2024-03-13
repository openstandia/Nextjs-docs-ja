---
title: productionBrowserSourceMaps
description: プロダクションビルド中にブラウザのソースマップの生成を有効にします。
sidebar_position: 25
---

Source Map は開発時にはデフォルトで有効になっています。プロダクション環境でのビルド時には、クライアント側にソースが漏れるのを防ぐため、設定フラグでオプトインしない限り、Source Map は無効になります。

Next.js には、本番ビルド時にブラウザの Source Map 生成を有効にするための設定フラグが用意されています：

```js title="next.config.js"
module.exports = {
  productionBrowserSourceMaps: true,
}
```

`productionBrowserSourceMaps`オプションを有効にすると、Source Map は JavaScript ファイルと同じディレクトリに出力されます。Next.js は、リクエストに応じて自動的にこれらのファイルを提供します。

- Source Map を追加すると、`next build`に時間がかかる場合もあります
- `next build`時のメモリ使用量が増加する
