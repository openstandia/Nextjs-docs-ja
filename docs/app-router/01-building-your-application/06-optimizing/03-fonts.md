---
title: Font最適化
nav_title: Fonts
description: 内蔵された next/font ローダーを使用して、アプリケーションのウェブフォントを最適化しましょう。
related:
  title: API リファレンス
  description: Learn more about the next/font API.
  links:
    - app-router/api-reference/components/font
---

[`next/font`](/docs/app-router/api-reference/components/font)は、フォント（カスタムフォントを含む）を自動的に最適化し、プライバシーとパフォーマンスを向上させるために外部ネットワーク要求を削除します。

🎥 Watch： `next/font`の使い方をもっと知る →[YouTube（6 分）](https://www.youtube.com/watch?v=L8_98i_bMMA).

`next/font`には、*あらゆる*フォントファイルに対する**自動セルフホスティング機能**が組み込まれています。これは、使用されている CSS の`size-adjust`属性のおかげで、レイアウトシフトをゼロにしてウェブフォントを最適に読み込むことができることを意味します。

この新しいフォントシステムにより、パフォーマンスとプライバシーを考慮したすべての Google Fonts を便利に使用できます。CSS とフォントのファイルはビルド時にダウンロードされ、残りの静的アセットと一緒にセルフホストされます。**ブラウザから Google にリクエストが送信されることはありません**。

## Google Fonts

任意の Google Font を自動的にセルフホストします。フォントはデプロイメントに含まれ、デプロイメントと同じドメインから提供されます。**ブラウザから Google にリクエストが送信されることはありません**。

`next/font/google`から使用したいフォントを関数としてインポートして使用します。最高のパフォーマンスと柔軟性を実現するには、[可変フォント](https://fonts.google.com/variablefonts)を使用することをお勧めします。

```tsx title="app/layout.tsx"
import { Inter } from 'next/font/google'

// 可変フォントを読み込む場合、フォントのウェイトを指定する必要はありません
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  )
}
```

可変フォントが使えない場合は、**ウェイトを指定する必要があります**：

```tsx title="app/layout.tsx"
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

配列を使い、ウェイトやスタイルを複数指定できます。

```tsx title="app/layout.js"
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})
```

> **Good to know**： 複数の単語を含むフォント名にはアンダースコア(\_)を使用してください。例：`Roboto Mono`は`Roboto_Mono`としてインポートします。

### サブセットの指定

Google Fonts は自動的に[サブセットされます](https://fonts.google.com/knowledge/glossary/subsetting)。これにより、フォントファイルのサイズが小さくなり、パフォーマンスが向上します。どのサブセットをプリロードするかを定義する必要があります。[`preload`](/docs/app-router/api-reference/components/font#preload)が`true`のときにサブセットを指定しないと、警告が表示されます。

これは、関数呼び出しに追加することで実行できます：

```tsx title="app.layout.tsx"
const inter = Inter({ subsets: ['latin'] })
```

詳細については[Font API リファレンス](/docs/app-router/api-reference/components/font)を参照してください。

### 複数のフォントを使用する

アプリケーションで複数のフォントをインポートして使用できます。2 つのアプローチがあります。

最初のアプローチは、フォントをエクスポートするユーティリティ関数を用意し、それをインポートし必要な場所で`className`を適用します。これにより、レンダリング時にのみフォントがプリロードされるようになります：

```tsx title="app/fonts.ts"
import { Inter, Roboto_Mono } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
```

```tsx title="layout.tsx"
import { inter } from './fonts'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```tsx title="app/page.tsx"
import { roboto_mono } from './fonts'

export default function Page() {
  return (
    <>
      <h1 className={roboto_mono.className}>My page</h1>
    </>
  )
}
```

上の例では`Inter`はグローバルに適用され、`Roboto Mono`は必要に応じてインポートして適用できます。

他のアプローチは、[CSS 変数](/docs/app-router/api-reference/components/font#variable)を作成し、お好みの CSS ソリューションで使用できます：

```tsx title="app/layout.tsx"
import { Inter, Roboto_Mono } from 'next/font/google'
import styles from './global.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>
        <h1>My App</h1>
        <div>{children}</div>
      </body>
    </html>
  )
}
```

```css title="app/global.css"
html {
  font-family: var(--font-inter);
}

h1 {
  font-family: var(--font-roboto-mono);
}
```

上の例では、`Inter`がグローバルに適用され、`<h1>`タグには`Roboto Monot`が適用されます。

> **推奨**：新しいフォントが追加されるたびに、クライアントがダウンロードしなければならないリソースが増えるため、複数のフォントの使用は控えめにしましょう。

## ローカルのフォント

`next/font/local`をインポートし、ローカルのフォントファイルの`src`を指定します。最高のパフォーマンスと柔軟性のために、[可変フォント](https://fonts.google.com/variablefonts)を使用することをお勧めします。

```tsx title=""
import localFont from 'next/font/local'

// フォントファイルは`app`ディレクトリ内にコロケートできる
const myFont = localFont({
  src: './my-font.woff2',
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

1 つのフォント・ファミリーに対して複数のファイルを使いたい場合は、src を配列にします：

```tsx
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```

詳細については、[Font API リファレンス](/docs/app-router/api-reference/components/font)を参照してください。

## Tailwind CSS と使用する

`next/font`は、[CSS 変数](/docs/app-router/api-reference/components/font#css-変数)を通して[Tailwind CSS](https://tailwindcss.com/)とあわせて使用できます。

以下の例では、`next/font/google`の`Inter`フォントを使用しています（Google またはローカルの任意のフォントを使用できます）。`variable`オプションでフォントを読み込んで CSS 変数名を定義し、それを`Inter`に割り当てます。次に、`inter.variable`を使って CSS 変数を HTML ドキュメントに追加します。

```tsx title="app/layout.tsx"
import { Inter, Roboto_Mono } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${roboto_mono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

最後に、CSS 変数を[Tailwind CSS の設定ファイル](/docs/app-router/building-your-application/styling/tailwind-css#configuring-tailwind)に追加します：

```tsx title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-roboto-mono)'],
      },
    },
  },
  plugins: [],
}
```

これで、`font-sans`ユーティリティクラスと`font-mono`ユーティリティクラスを使って、要素にフォントを適用できるようになりました。

## プリロード

サイトのページでフォント関数が呼び出されたとき、そのフォントはグローバルに利用はできず、すべてのルートにプリロードされるわけではありません。フォントが使用されるファイルのタイプに基づいて、関連するルートにのみプリロードされます：

- [固有のページ](/docs/app-router/building-your-application/routing/pages-and-layouts#ページ)であれば、そのページの固有のルートにプリロードされます
- [レイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#レイアウト)の場合、レイアウトによってラップされたすべてのルートにプリロードされます
- [ルートレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts#ルートレイアウト-必須)の場合、すべてのルートにプリロードされます

## フォントの再利用

localFont または Google フォント関数を呼び出すたびに、そのフォントはアプリケーション内で 1 つのインスタンスとしてホストされます。したがって、同じフォント関数を複数のファイルで読み込むと、同じフォントの複数のインスタンスがホストされることになります。このような場合は、次のようにすることをお勧めします：

- フォントローダー関数を 1 つの共有ファイル内で呼び出す
- それを定数としてエクスポート
- このフォントを使いたい各ファイルで、この定数をインポートする

## API リファレンス

next/font API についてもっと知りたい場合は以下を参照してください。

/docs/app-router/api-reference/components/font
