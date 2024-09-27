---
title: CSS Modules
description: CSS Modules を使用して Next.js アプリケーションをスタイルします。
---

Next.js は、`.module.css` 拡張子を使用して CSS Modules を組み込みでサポートしています。

CSS Modules は、一意のクラス名を自動的に作成することで CSS をローカルスコープにします。これにより、異なるファイルでクラス名の衝突を心配せずに使用できます。そのため、CSS Modules はコンポーネントレベルの CSS を含める理想的な方法です。

## 例

CSS Modules は、`app` ディレクトリ内の任意のファイルでインポートできます:

```tsx title="app/dashboard/layout.tsx"
import styles from './styles.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className={styles.dashboard}>{children}</section>
}
```

```css title="app/dashboard/styles.module.css"
.dashboard {
  padding: 24px;
}
```

CSS Modules は、オプションの機能であり、**`.module.css` 拡張子を持つファイルでのみ有効**です。通常の `<link>` スタイルシートやグローバル CSS ファイルも引き続きサポートされます。

本番環境では、すべての CSS Modules ファイルが自動的に**多くの最小化されたコード分割** された `.css` ファイルに結合されます。
これらの `.css` ファイルはアプリケーションのターゲットとなる実行パスを表し、アプリケーションを描画するために必要な最小限の CSS が読み込まれることを保証します。

## グローバルスタイル

グローバルスタイルは、`app` ディレクトリ内の任意のレイアウト、ページ、またはコンポーネントにインポートできます。

> **Good to know**: これは グローバルスタイルを `_app.js` ファイル内でのみインポートできる `pages` ディレクトリとは異なります。

例として、`app/global.css`というスタイルシートを考えてみましょう:

```css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

ルートレイアウト (`app/layout.js`) 内で `global.css` スタイルシートをインポートし、アプリケーションのすべてのルートにスタイルを適用します:

```tsx title="app/layout.tsx"
// これらのスタイルはアプリケーションの各ルートに適用されます
import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## 外部スタイルシート

外部パッケージによって公開されたスタイルシートは、コロケートされたコンポーネントを含む `app` ディレクトリ内の任意の場所でインポートできます:

```tsx title="app/layout.tsx"
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> **Good to know**: 外部スタイルシートは、npm パッケージから直接インポートするか、コードベースと共にダウンロードして配置する必要があります。`<link rel="stylesheet" />` を使用することはできません。

## 追加の機能

Next.js には、スタイルを作成する体験を向上させるための追加の機能が含まれています:

- `next dev` でローカル実行するとき、ローカルのスタイルシート（グローバルまたは CSS Modules）は[Fast Refresh](/docs/app-router/architecture/fast-refresh) を利用して、保存されたときに変更が即座に反映されます。
- `next build` で本番用にビルドするとき、CSS ファイルはネットワークリクエストの数を減らすために少ない数の最小化された `.css` ファイルにバンドルされます。
- JavaScript を無効にした場合でも、本番ビルド (`next start`) でスタイルが読み込まれます。ただし、[Fast Refresh](/docs/app-router/architecture/fast-refresh)を有効にするためには、`next dev` で JavaScript が必要です。