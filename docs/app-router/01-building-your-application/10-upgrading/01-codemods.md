---
title: Codemods
description: Use codemods to upgrade your Next.js codebase when new features are released.
---

Codemods は、コードベース上でプログラム的に実行される変換機能です。これにより、手作業ですべてのファイルに目を通すことなく、プログラムで多くの変更を適用できます。

Next.js は、API が更新されたり廃止されたりしたときに、Next.js のコードベースをアップグレードするための Codemod による変換機能を提供します。

## 使用方法

ターミナルでプロジェクトのフォルダへ移動し（`cd`）、以下を実行します：

```bash title="Terminal"
npx @next/codemod <transform> <path>
```

`<transform>`と`<path>`は適切な値に置き換えてください。

- `transform` - 変換の名前
- `path` - 変換するファイルまたはディレクトリ
- `--dry` - ドライランを行い、コードは編集されない
- `--print` - 比較のために変更された出力を表示する

## Next.js Codemods

### 14.0

#### `ImageResponse` インポートの移行

##### `next-og-import`

```bash title="Terminal"
npx @next/codemod@latest next-og-import .
```

この codemod は、[ダイナミック OG イメージ生成](/docs/app-router/building-your-application/optimizing/metadata#dynamic-image-generation)を使用するために、トランスフォームのインポートを `next/server` から `next/og` に移動します。

例：

```js
import { ImageResponse } from 'next/server'
```

上記の文は以下のように変換されます：

```js
import { ImageResponse } from 'next/og'
```

#### Use viewport export

##### `metadata-to-viewport-export`

```bash title="Terminal"
npx @next/codemod@latest metadata-to-viewport-export .
```

この codemod は、特定のビューポートのメタデータを `viewport` のエクスポートに移行します。

例：

```js
export const metadata = {
  title: 'My App',
  themeColor: 'dark',
  viewport: {
    width: 1,
  },
}
```

上記の文は以下のように変換されます：

```js
export const metadata = {
  title: 'My App',
}

export const viewport = {
  width: 1,
  themeColor: 'dark',
}
```

### 13.2

#### ビルトインの Font を使用する

##### `built-in-next-font`

```bash title="Terminal"
npx @next/codemod@latest built-in-next-font .
```

この Codemod は`@next/font`パッケージをアンインストールし、`@next/font`のインポートをビルトインの`next/font`に変換します。

例：

```ts
import { Inter } from '@next/font/google'
```

上記の文は以下のように変換されます：

```ts
import { Inter } from 'next/font/google'
```

### 13.0

#### Next Image のインポートをリネームする

##### `next-image-to-legacy-image`

```bash title="Terminal"
npx @next/codemod@latest next-image-to-legacy-image .
```

既存の Next.js 10、11、12 アプリケーションの`next/image`のインポートを、Next.js 13 の`next/legacy/image`に安全にリネームします。また`next/future/image`を`next/image`にリネームします。

例：

```jsx title="page/index.js"
import Image1 from 'next/image'
import Image2 from 'next/future/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

上記のコードは以下のように変換されます：

```jsx title="page/index.js"
// 'next/image'が'next/legacy/image'になる
import Image1 from 'next/legacy/image'
// 'next/future/image'が'next/image'になる
import Image2 from 'next/image'

export default function Home() {
  return (
    <div>
      <Image1 src="/test.jpg" width="200" height="300" />
      <Image2 src="/test.png" width="500" height="400" />
    </div>
  )
}
```

#### 新しい Image コンポーネントへの移行

##### `next-image-experimental`

```bash title="Terminal"
npx @next/codemod@latest next-image-experimental .
```

インラインスタイルを追加し、未使用の props を削除することによって、`next/legacy/image`から新しい`next/image`に移行する危険な移行です。

- `layout` prop を削除し、`style`を追加
- `objectFit`prop を削除し、`style`を追加
- `objectPosition` prop を削除し、`style`を追加
- `lazyBoundary` prop を削除
- `lazyRoot` prop を削除

#### `<a>`タグを Link コンポーネントから削除する

##### `new-link`

```bash title="Terminal"
npx @next/codemod@latest new-link .
```

Link コンポーネント内の`<a>`タグを削除するか、自動修正できないリンクに対しては`legacyBehavior` prop を追加します。

例：

```tsx
<Link href="/about">
  <a>About</a>
</Link>
// transforms into
<Link href="/about">
  About
</Link>

<Link href="/about">
  <a onClick={() => console.log('clicked')}>About</a>
</Link>
// transforms into
<Link href="/about" onClick={() => console.log('clicked')}>
  About
</Link>
```

自動修正が適用できない場合、`legacyBehavior` prop が追加されます。これにより、アプリはその特定のリンクに対して古い振る舞いで機能し続けることができます。

```tsx
const Component = () => <a>About</a>

<Link href="/about">
  <Component />
</Link>
// becomes
<Link href="/about" legacyBehavior>
  <Component />
</Link>
```

### 11

#### CRA からの移行

##### `cra-to-next`

```bash title="Terminal"
npx @next/codemod cra-to-next
```

Create React App で作成したプロジェクトを Next.js に移行し、Pages Router と必要な設定を作成して動作を合わせます。クライアントサイドのみのレンダリングは、SSR 中の`window`使用による互換性を維持するために最初は活用されますが、Next.js 固有の機能を徐々に採用できるようになります。

この変換に関する意見・感想は、[このディスカッション](https://github.com/vercel/next.js/discussions/25858)へ共有してください。

### 10

#### React のインポートを追加する

##### `add-missing-react-import`

```bash title="Terminal"
npx @next/codemod add-missing-react-import
```

新しい[React JSX トランスフォーム](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)を動作させるために、`React`をインポートしていないファイルにインポートを含めるように変換します。

例：

```js title="my-component.js"
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```

上記のコードは以下のように変換されます：

```js title="my-component.js"
import React from 'react'
export default class Home extends React.Component {
  render() {
    return <div>Hello World</div>
  }
}
```

### 9

#### 匿名コンポーネントを名前付きコンポーネントに変換する

##### `name-default-component`

```bash title="Terminal"
npx @next/codemod name-default-component
```

##### v9 以上の場合

匿名コンポーネントを名前付きコンポーネントに変換し、[Fast Refresh](https://nextjs.org/blog/next-9-4#fast-refresh)で動作するようにします。

例：

```jsx title="my-component.js"
export default function () {
  return <div>Hello World</div>
}
```

上記のコードは以下のように変換されます：

```jsx title="my-component.js"
export default function MyComponent() {
  return <div>Hello World</div>
}
```

このコンポーネントは、ファイル名に基づいたキャメルケースの名前が付けられ、アロー関数にも適用できます。

### 8

#### AMP HOC をページの設定に変換する

##### `withmap-to-config`

```bash title="Terminal"
npx @next/codemod withamp-to-config
```

`withAmp` HOC を Next.js 9 のページ設定に変換します。

例：

```js title="my-component.js"
// Before
import { withAmp } from 'next/amp'

function Home() {
  return <h1>My AMP Page</h1>
}

export default withAmp(Home)
```

上記のコードは以下のように変換されます：

```js title="my-component.js"
// After
export default function Home() {
  return <h1>My AMP Page</h1>
}

export const config = {
  amp: true,
}
```

### 6

#### `withRouter`を使用する

##### `url-to-withrouter`

```bash title="Terminal"
npx @next/codemod url-to-withrouter
```

トップレベルページに自動で注入される非推奨な`url`プロパティを、`withRouter`とそれが注入する`router`プロパティを使用するように変換します。詳しくはこちら：[https://nextjs.org/docs/messages/url-deprecated](https://nextjs.org/docs/messages/url-deprecated)

例：

```jsx title="From"
import React from 'react'
export default class extends React.Component {
  render() {
    const { pathname } = this.props.url
    return <div>Current pathname: {pathname}</div>
  }
}
```

```jsx title="To"
import React from 'react'
import { withRouter } from 'next/router'
export default withRouter(
  class extends React.Component {
    render() {
      const { pathname } = this.props.router
      return <div>Current pathname: {pathname}</div>
    }
  }
)
```

これは 1 例です。変換された（そしてテストされた）すべての例は[`__testfixtures__`](https://github.com/vercel/next.js/tree/canary/packages/next-codemod/transforms/__testfixtures__/url-to-withrouter)ディレクトリにあります。
