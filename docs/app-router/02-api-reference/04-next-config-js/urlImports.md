---
タイトル: urlImports
説明: Next.jsで外部URLからモジュールをインポートする設定（Experimental）。
---

URLインポートは（ローカルディスクからではなく）直接外部サーバーからモジュールをインポートするための実験的機能です。

> **警告**: この機能は実験的です。信頼できるドメインのみからダウンロードし、使用するマシンで実行してください。この機能が安定していると判断されるまでは、慎重に使用してください。

オプトインするには、`next.config.js`内に許可する URL プレフィクスを追加します:

```js title="next.config.js"
module.exports = {
  experimental: {
    urlImports: ['https://example.com/assets/', 'https://cdn.skypack.dev'],
  },
}
```

次に、URLから直接モジュールをインポートできます:

```js
import { a, b, c } from 'https://example.com/assets/some/module.js'
```

URLインポートは、通常のパッケージインポートが使用できる場所ならどこでも使用できます。

## セキュリティモデル

この機能は**セキュリティを最優先で**設計されています。まず、URLインポートを受け入れるドメインを明示的に許可するための実験的なフラグを追加しています。URL インポートがブラウザのサンドボックス内で実行されるように、[Edge Runtime](/docs/app-router/api-reference/edge)を使用し制限することで、これをさらに推進する予定です。

## ロックファイル

URLインポートを使用すると、Next.jsはロックファイルとフェッチされたアセットを含んだ`next.lock`ディレクトリを作成します。このディレクトリは、`.gitignore`で無視せずに、**Gitでコミットする必要があります**。

- `next dev`を実行すると、Next.jsは新しく見つけたすべてのURLインポートをダウンロードしてロックファイルに追加します
- `next build`を実行すると、Next.jsはロックファイルのみを使用して、アプリケーションを本番用にビルドします

通常、ネットワークリクエストは必要なく、古いロックファイルはビルドに失敗する原因となります。例外は、`Cache-Control: no-cache`で応答するリソースです。これらのリソースはロックファイルに`no-cache`エントリーとして記録され、ビルドごとに常にネットワークからフェッチされます。

## 例

### Skypack

```js
import confetti from 'https://cdn.skypack.dev/canvas-confetti'
import { useEffect } from 'react'

export default () => {
  useEffect(() => {
    confetti()
  })
  return <p>Hello</p>
}
```

### 静的画像のインポート

```js
import Image from 'next/image'
import logo from 'https://example.com/assets/logo.png'

export default () => (
  <div>
    <Image src={logo} placeholder="blur" />
  </div>
)
```

### CSS内のURL

```css
.className {
  background: url('https://example.com/assets/hero.jpg');
}
```

### アセットのインポート

```js
const logo = new URL('https://example.com/assets/file.txt', import.meta.url)

console.log(logo.pathname)

// "/_next/static/media/file.a9727b5d.txt" を出力
```
