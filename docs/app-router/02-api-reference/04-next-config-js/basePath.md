---
title: basePath
description: basePath を使用して、Next.js アプリケーションをドメインのサブパスにデプロイします。
sidebar_position: 3
---

Next.js アプリケーションをドメインのサブパスにデプロイするには、`basePath`設定オプションを使います。

`basePath`では、アプリケーションのパスの接頭辞を設定できます。たとえば、`''`（デフォルトの空文字列）の代わりに`/docs`を使用するには、`next.config.js`を開き、`basePath`設定を追加します：

```js title="next.config.js"
module.exports = {
  basePath: '/docs',
}
```

> **Good to know**: この値はビルド時に設定する必要があり、クライアント側のバンドルにインライン化されているため、変更するには再ビルドする必要があります。

## Link

`next/link`や`next/router`を使って他のページにリンクする場合、`basePath`は自動的に適用されます。

例えば、`basePath`が`/docs`に設定されていると、`/about`は自動的に`/docs/about`になります。

```js
export default function HomePage() {
  return (
    <>
      <Link href="/about">About Page</Link>
    </>
  )
}
```

HTML は以下のように出力されます：

```js
<a href="/docs/about">About Page</a>
```

これにより、`basePath`の値を変更する際に、アプリケーション内のすべてのリンクを変更する必要はありません。

## 画像

`next/image`コンポーネントを使用する場合は、`src`の前に`basePath`を追加する必要があります。

例えば、`basePath`が`/docs`に設定されている場合、画像が適切に配信されるようにするには`/docs/me.png`を使用します。

```js
import Image from 'next/image'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/docs/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}

export default Home
```
