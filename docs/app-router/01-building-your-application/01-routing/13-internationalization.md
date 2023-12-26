---
title: 国際化
description: Add support for multiple languages with internationalized routing and localized content.
---

Next.js では、多言語に対応したコンテンツのルーティングやレンダリングを設定できます。サイトを異なるロケールに適応させるには、翻訳されたコンテンツ（ローカライズ）と国際化されたルーティングが必要です。

## 用語

- **ロケール(Locale):** 言語や書式の設定を表す識別子。これには通常、ユーザーの好みの言語と、場合によっては地理的な地域が含まれる。
  - `en-US`： アメリカで話されている英語
  - `nl-NL`： `nl-NL`: オランダで話されているオランダ語
  - `nl`： オランダ語、地域は特定しない

## ルーティングの概要

どのロケールを使うかは、ブラウザの言語設定を使うことを推奨します。優先言語を変更すると、アプリケーションに送られてくる `Accept-Language` ヘッダが変更されます。

例えば、以下のライブラリを使用すると、送られてくる `Request` を見て、 `Headers`、サポートする予定のロケール、デフォルトのロケールに基づいて、どのロケールを選択するかを決定できます。

```jsx filename="middleware.js"
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en-US', 'nl-NL', 'nl']
let defaultLocale = 'en-US'

match(languages, locales, defaultLocale) // -> 'en-US'
```

ルーティングはサブパス（`/fr/products`）またはドメイン（`my-site.fr/products`）によって国際化できます。この情報があれば、[Middleware](/docs/app-router/building-your-application/routing/middleware)内のロケールに基づいてユーザーをリダイレクトできるようになります。

```jsx filename="middleware.js"
import { NextResponse } from 'next/server'

let locales = ['en-US', 'nl-NL', 'nl']

// Get the preferred locale, similar to above or using a library
function getLocale(request) { ... }

export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
```

最後に、`app/`内のすべての特殊ファイルが、`app/[lang]`の下にネストされていることを確認してください。こうすることで、Next.js の Router はルート内で異なるロケールを動的に処理し、`lang`パラメータをすべてのレイアウトとページに転送できるようになります。例えば

```jsx filename="app/[lang]/page.js"
// You now have access to the current locale
// e.g. /en-US/products -> `lang` is "en-US"
export default async function Page({ params: { lang } }) {
  return ...
}
```

ルートレイアウトは新しいフォルダにネストすることもできます（例：`app/[lang]/layout.js`）。

## ローカライゼーション

ユーザーの好みのロケール（地域化）に基づいて表示内容を変更することは、Next.js に限ったことではありません。以下に説明するパターンは、どんなウェブアプリケーションでも同じように機能します。

アプリケーション内で英語とオランダ語のコンテンツをサポートしたいとします。2 つの異なる "辞書 "を管理することになります。これは、あるキーからローカライズされた文字列へのマッピングを与えるオブジェクトです。例えば

```jsx filename="dictionaries/en.json"
{
  "products": {
    "cart": "Add to Cart"
  }
}
```

```jsx filename="dictionaries/nl.json"
{
  "products": {
    "cart": "Toevoegen aan Winkelwagen"
  }
}
```

そして、要求されたロケールの翻訳を読み込むために `getDictionary` 関数を作成します。

```jsx filename="app/[lang]/dictionaries.js"
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[locale]()
```

現在選択されている言語が与えられれば、レイアウトやページ内の辞書を取得できます。

```jsx filename="app/[lang]/page.js"
import { getDictionary } from './dictionaries'

export default async function Page({ params: { lang } }) {
  const dict = await getDictionary(lang) // en
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

`app/`ディレクトリのすべてのレイアウトとページのデフォルトは[Server Components](/docs/app-router/building-your-application/rendering/server-components)なので、翻訳ファイルのサイズがクライアントサイドの JavaScript バンドルのサイズに影響することを心配する必要はありません。このコードは**サーバー**でのみ実行され、結果の HTML のみがブラウザに送信されます。

## 静的生成

指定したロケールの静的なルートを生成するには、任意のページやレイアウトで `generateStaticParams` を使用します。これは例えばルートレイアウトのようなグローバルなものです。

```jsx filename="app/[lang]/layout.js"
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}

export default function Root({ children, params }) {
  return (
    <html lang={params.lang}>
      <body>{children}</body>
    </html>
  )
}
```

## Examples

- [Minimal i18n routing and translations](https://github.com/vercel/next.js/tree/canary/examples/app-dir-i18n-routing)
- [next-intl](https://next-intl-docs.vercel.app/docs/next-13)
