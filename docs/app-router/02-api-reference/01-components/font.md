---
title: Fontモジュール
sidebar_label: Font
description: 組み込みの next/font ローダーを使用して、Webフォントの読み込みを最適化します。
sidebar_position: 1
---

この API リファレンスは、[`next/font/google`](/docs/app-router/building-your-application/optimizing/fonts#google-fonts)と[`next/font/local`](/docs/app-router/building-your-application/optimizing/fonts#ローカルのフォント)の使い方を理解するのに役立ちます。機能や使い方については、[フォントの最適化](/docs/app-router/building-your-application/optimizing/fonts)ページを参照してください。

## Font 関数の引数

使用方法については、[Google Fonts](/docs/app-router/building-your-application/optimizing/fonts#google-fonts)と[Local Fonts](/docs/app-router/building-your-application/optimizing/fonts#ローカルのフォント)を参照してください。

| Key                                         | `font/google` | `font/local` | 型                          | 必須              |
| :------------------------------------------ | :------------ | :----------- | :-------------------------- | :---------------- |
| [`src`](#src)                               | ×             | ✅           | String または Object の配列 | Yes               |
| [`weight`](#weight)                         | ✅            | ✅           | String または 配列          | Required/Optional |
| [`style`](#style)                           | ✅            | ✅           | String または 配列          | -                 |
| [`subsets`](#subsets)                       | ✅            | ×            | String 配列                 | -                 |
| [`axes`](#axes)                             | ✅            | ×            | String 配列                 | -                 |
| [`display`](#display)                       | ✅            | ✅           | String                      | -                 |
| [`preload`](#preload)                       | ✅            | ✅           | Boolean                     | -                 |
| [`fallback`](#fallback)                     | ✅            | ✅           | String 配列                 | -                 |
| [`adjustFontFallback`](#adjustfontfallback) | ✅            | ✅           | Boolean または String       | -                 |
| [`variable`](#variable)                     | ✅            | ✅           | String                      | -                 |
| [`declarations`](#declarations)             | ×             | ✅           | Object 配列                 | -                 |

### `src`

<!-- textlint-disable -->

フォントファイルのパス。文字列、またはオブジェクトの配列（`Array<{path: string, weight?: string, style?: string}>`型）として、フォントローダ関数が呼び出されたディレクトリからの相対パス。

<!-- textlint-enable -->

`next/font/local`で使用：

- 必須

例：

- `app`ディレクトリ内の`fonts`というディレクトリに`my-font.woff2`が置かれた場合、`src:'./fonts/my-font.woff2'`
<!-- textlint-disable -->
- `src:[{path: './inter/Inter-Thin.ttf', weight: '100',},{path: './inter/Inter-Regular.ttf',weight: '400',},{path: './inter/Inter-Bold-Italic.ttf', weight: '700',style: 'italic',},]`
- フォントローダー関数が`app/page.tsx`で`src:'../styles/fonts/my-font.ttf'`を使って呼び出された場合、`my-font.ttf`はプロジェクトのルートの`styles/fonts`に置かれます
<!-- textlint-enable -->

### `weight`

以下の場合におけるフォントの[weight](https://fonts.google.com/knowledge/glossary/weight)：

- 特定のフォントについて利用可能なウェイトの値を文字列で表したもの、 あるいは[可変フォント](https://fonts.google.com/variablefonts)の場合は値の範囲
- そのフォントが[可変の google フォント](https://fonts.google.com/variablefonts)でない場合は、重み値の配列。`next/font/google`にのみ適用されます

`next/font/google`および`next/font/local`で使用：

- 使用するフォントが[可変](https://fonts.google.com/variablefonts)でない場合は必須

例：

<!-- textlint-disable -->

- `weight: '400'`：[Inter](https://fonts.google.com/specimen/Inter?query=inter)フォントの場合、とりうる値は`'100'`、`'200'`、`'300'`、`'400'`、`'500'`、`'600''`、`'700'`、`'800'`、`'900'`あるいは `'variable'`で、`'variable'`がデフォルトです）
<!-- textlint-enable -->
- `weight: '100 900'`：可変フォントの`100`から`900`までの範囲の文字列
- `weight: ['100','400','900']`：可変フォントでない場合にとりうる 3 つの値の配列

### `style`

以下の場合におけるフォントの[style](https://developer.mozilla.org/docs/Web/CSS/font-style)：

- デフォルト値が`'normal'`の文字列[値](https://developer.mozilla.org/docs/Web/CSS/font-style#values)。
- フォントが[可変の google フォント](https://fonts.google.com/variablefonts)でない場合のスタイル値の配列。`next/font/google`にのみ適用されます。

`next/font/google`および`next/font/local`で使用：

- 任意

例：

- `style: 'italic'`：文字列 - `next/font/google`では`normal`または`italic`になります
- `style: 'oblique'`：文字列 - `next/font/local`に対しては任意の値を取りますが、[標準フォントスタイル](https://developer.mozilla.org/docs/Web/CSS/font-style)から来ることが期待されます
- `style: ['italic','normal']`：`next/font/google`に対する 2 つの値の配列 - 値は`normal`と`italic`

### `subsets`

[プリロード](/docs/app-router/building-your-application/optimizing/fonts#サブセットの指定)させたい各サブセットの名前を文字列値の配列で定義したフォント[サブセット](https://fonts.google.com/knowledge/glossary/subsetting)。サブセットを通じて指定されたフォントは、[`preload`](#preload)オプションが`true`（デフォルト）のときは、リンク`preload`タグが head に注入されます。

`next/font/google`で使用：

- 任意

例：

- `subset: ['latin']`：サブセット`latin`を含む配列

すべてのサブセットの一覧は、フォントの Google Fonts ページで見ることができます

### `axes`

一部の可変フォントには、`axes`を含められるものがあります。デフォルトでは、フォントのウェイトだけが含まれています。可能な`axes`の値は特定のフォントに依存します。

`next/font/google`で使用：

- オプション

例：

- `axes: ['slnt']`：[ここ](https://fonts.google.com/variablefonts?vfquery=inter#font-families)で示されているように、追加の`axes`として`slnt`を持つ可変フォント`Inter`に対する、値`slnt`を持つ配列。[Google 可変フォント](https://fonts.google.com/variablefonts#font-families)のページでフィルタを使い、`wght`以外の axes を探すことで、使用するフォントに使用可能な`axes`の値を見つけることができます。

### `display`

フォントの[display](https://developer.mozilla.org/docs/Web/CSS/@font-face/font-display)を指定し、文字列値として`'auto'`、`'block'`、`'swap'`、`'fallback'`あるいは`'optional'`が指定可能で、デフォルト値は`'swap'`です。

`next/font/google`および`next/font/local`で使用：

- 任意

例：

- `display: 'optional'`：`optional`値に割り当てられた文字列

### `preload`

フォントを[プリロード](/docs/app-router/building-your-application/optimizing/fonts#プリロード)するかどうかを指定するブール値。デフォルトは true。

`next/font/google`および`next/font/local`で使用：

- 任意

例：

- `preload: false`

### `fallback`

フォントを読み込めない場合に使用するフォールバックフォント。フォールバックフォントの文字列の配列で、デフォルトはありません。

- 任意

`next/font/google`および`next/font/local`で使用

例：

- `fallback：['system-ui', 'arial']`：フォールバックフォントを `system-ui`または`arial`に設定する配列

### `adjustFontFallback`

- `next/font/google`の場合：[累積レイアウトシフト](https://web.dev/cls/)を減らすために自動フォールバックフォントを使うかどうかを設定するブール値。デフォルトは`true`
- `next/font/local`の場合：[累積レイアウトシフト](https://web.dev/cls/)を軽減するために自動で予備フォントを用いるかどうかを設定する文字列または論理値。とりうる値は`'Arial'`、`'Times New Roman'`あるいは`false`。デフォルトは `'Arial'`です

`next/font/google`および`next/font/local`で使用

- 任意

例：

- `adjustFontFallback: false`： `next/font/google`の場合
- `adjustFontFallback: 'Times New Roman'`: `next/font/local`の場合

### `variable`

スタイルが[CSS 変数](#css-変数)で適用される場合に使用される CSS 変数名を定義する文字列値。

`next/font/google`および`next/font/local`で使用

- 任意

例：

- `variable: '--my-font'`：CSS 変数`--my-font`が宣言されます。

### `declarations`

生成された`@font-face`をさらに定義するフォントフェイス・[ディスクリプタ](https://developer.mozilla.org/docs/Web/CSS/@font-face#descriptors)のキーと値のペアの配列。

`next/font/local`で使用

- 任意

例：

- `declarations: [{ prop: 'ascent-override', value: '90%' }]`

## スタイルの適用

フォントスタイルは 3 つの方法で適用できます：

- [`className`](#classname)
- [`style`](#style-1)
- [CSS 変数](#css-変数)

### `className`

HTML 要素に渡す、読み込んだフォントの CSS `className`を読み込み専用で返します。

```jsx
<p className={inter.className}>Hello, Next.js!</p>
```

### `style`

HTML 要素に渡される、読み込まれたフォントの読み取り専用の CSS`style`オブジェクトを返します。フォントファミリー名とフォールバックフォントにアクセスするための`style.fontFamily`を含みます。

```jsx
<p style={inter.style}>Hello World</p>
```

### CSS 変数

外部スタイル・シートにスタイルを設定し、そこに追加オプションを指定したい場合は、CSS 変数によるスタイリングを使用します。

フォントをインポートするだけでなく、CSS 変数が定義されている CSS ファイルをインポートし、フォント・ローダーオブジェクトの変数オプションを以下のように設定します：

```tsx title="app/page.tsx"
import { Inter } from 'next/font/google'
import styles from '../styles/component.module.css'

const inter = Inter({
  variable: '--font-inter',
})
```

<!-- textlint-disable -->

フォントを使用するには、スタイルを設定したいテキストの親コンテナの`className`をフォントローダーの`variable`値に設定し、テキストの`className`を外部 CSS ファイルの`styles`プロパティに設定します。

<!-- textlint-enable -->

```tsx title="app/page.tsx"
<main className={inter.variable}>
  <p className={styles.text}>Hello World</p>
</main>
```

`component.module.css`の CSS ファイルに、以下のように`text`セレクタ・クラスを定義します：

```css title="styles/component.module.css"
.text {
  font-family: var(--font-inter);
  font-weight: 200;
  font-style: italic;
}
```

上の例では、テキスト`Hello World`は`Inter`フォントと生成されたフォールバック・フォントを使って`font-weight: 200`と`font-style: italic`でスタイリングされます。

## フォント定義ファイルを使用する

`localFont`または Google フォント関数を呼び出すたびに、そのフォントはアプリケーション内で 1 つのインスタンスとしてホストされます。したがって、同じフォントを複数の場所で使用する必要がある場合は、1 つの場所でフォントをロードし、必要な場所で関連するフォントオブジェクトをインポートする必要があります。これは、フォント定義ファイルを使って行います。

例えば、App ディレクトリのルートにある`styles`フォルダで`fonts.ts`ファイルを作成します。

そして、以下のようにフォント定義を指定します：

```ts title="styles.font.ts"
import { Inter, Lora, Source_Sans_3 } from 'next/font/google'
import localFont from 'next/font/local'

// 可変フォントを定義する
const inter = Inter()
const lora = Lora()
// 非可変フォントの2つのウェイトを定義する
const sourceCodePro400 = Source_Sans_3({ weight: '400' })
const sourceCodePro700 = Source_Sans_3({ weight: '700' })
// GreatVibes-Regular.ttfをstylesフォルダに格納し、カスタムローカルフォントを定義する
const greatVibes = localFont({ src: './GreatVibes-Regular.ttf' })

export { inter, lora, sourceCodePro400, sourceCodePro700, greatVibes }
```

次のように、これらの定義をコードで使うことができます：

```tsx title="app/page.tsx"
import { inter, lora, sourceCodePro700, greatVibes } from '../styles/fonts'

export default function Page() {
  return (
    <div>
      <p className={inter.className}>Hello world using Inter font</p>
      <p style={lora.style}>Hello world using Lora font</p>
      <p className={sourceCodePro700.className}>
        Hello world using Source_Sans_3 font with weight 700
      </p>
      <p className={greatVibes.className}>My title in Great Vibes font</p>
    </div>
  )
}
```

コード内のフォント定義へアクセスしやすくするために`tsconfig.json`ファイルまたは`jsconfig.json`ファイルで以下のようにパスエイリアスを定義できます：

```json title="tsconfig.json"
{
  "compilerOptions": {
    "paths": {
      "@/fonts": ["./styles/fonts"]
    }
  }
}
```

次のようにして、任意のフォント定義をインポートできます：

```tsx title="app/about/page.tsx"
import { greatVibes, sourceCodePro400 } from '@/fonts'
```

## バージョン履歴

| Version   | Changes                                                           |
| :-------- | :---------------------------------------------------------------- |
| `v13.2.0` | `@next/font`を`next/font`に変更。インストールが不要になりました。 |
| `v13.0.0` | `next/font`追加                                                   |
