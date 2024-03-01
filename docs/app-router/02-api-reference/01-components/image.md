---
title: <Image>
description: Optimize Images in your Next.js Application using the built-in `next/image` Component.
sidebar_position: 2
---

<details>
  <summary>例</summary>
  <div>
    <a href="https://github.com/vercel/next.js/tree/canary/examples/image-component">Image Component</a>
  </div>
</details>

この API リファレンスは、Image コンポーネントで利用可能な [props](#props) や[設定オプション](#設定オプション)の使い方を理解するのに役立ちます。機能や使い方については、 [Image コンポーネント](/docs/app-router/building-your-application/optimizing/images)のページを参照してください。

```js title="app/page.js"
import Image from 'next/image'

export default function Page() {
  return (
    <Image
      src="/profile.png"
      width={500}
      height={500}
      alt="Picture of the author"
    />
  )
}
```

## Props

Image コンポーネントで使用可能な主な Props は以下のとおりです：

| Prop                                      | Example                             | Type            | Required |
| ----------------------------------------- | ----------------------------------- | --------------- | -------- |
| [`src`](#src)                             | `src="/profile.png"`                | String          | Yes      |
| [`width`](#width)                         | `width={500}`                       | Integer (px)    | Yes      |
| [`height`](#height)                       | `height={500}`                      | Integer (px)    | Yes      |
| [`alt`](#alt)                             | `alt="Picture of the author"`       | String          | Yes      |
| [`loader`](#loader)                       | `loader={imageLoader}`              | Function        | -        |
| [`fill`](#fill)                           | `fill={true}`                       | Boolean         | -        |
| [`sizes`](#sizes)                         | `sizes="(max-width: 768px) 100vw"`  | String          | -        |
| [`quality`](#quality)                     | `quality={80}`                      | Integer (1-100) | -        |
| [`priority`](#priority)                   | `priority={true}`                   | Boolean         | -        |
| [`placeholder`](#placeholder)             | `placeholder="blur"`                | String          | -        |
| [`style`](#style)                         | `style={{objectFit: "contain"}}`    | Object          | -        |
| [`onLoadingComplete`](#onloadingcomplete) | `onLoadingComplete={img => done()}` | Function        | 非推奨   |
| [`onLoad`](#onload)                       | `onLoad={event => done()}`          | Function        | -        |
| [`onError`](#onerror)                     | `onError(event => fail()}`          | Function        | -        |
| [`loading`](#loading)                     | `loading="lazy"`                    | String          | -        |
| [`blurDataURL`](#blurdataurl)             | `blurDataURL="data:image/jpeg..."`  | String          | -        |

## 必須の Props

Image コンポーネントには、`src`、`width`、`height`、`alt`の各属性が必須です。

```jsx title="app/page.js"
import Image from 'next/image'

export default function Page() {
  return (
    <div>
      <Image
        src="/profile.png"
        width={500}
        height={500}
        alt="Picture of the author"
      />
    </div>
  )
}
```

### `src`

以下のどちらかを指定する必要があります：

- [静的にインポート](/docs/app-router/building-your-application/optimizing/images#ローカルの画像)された画像ファイル
- パス文字列。これは、[loader](#loader) prop の値により、外部の絶対 URL か内部パスのどちらかになります

外部 URL を使用する場合は、`next.config.js`の[remotePatterns](#remotepatterns)に追加する必要があります。

### `width`

`width`プロパティは*レンダリング*される幅をピクセル単位で表し、画像が表示される大きさに影響します。

[静的にインポートされた画像](/docs/app-router/building-your-application/optimizing/images#ローカルの画像)や[`fill`プロパティ](#fill)を持つ画像を除き、必須です。

### `height`

`height`プロパティは*レンダリング*の高さをピクセル単位で表し、画像が表示される大きさに影響します。

[静的にインポートされた画像](/docs/app-router/building-your-application/optimizing/images#ローカルの画像)や[`fill`プロパティ](#fill)を持つ画像を除き、必須です。

### `alt`

`alt`プロパティは、スクリーンリーダーや検索エンジンのために画像を説明するために使用されます。また画像が無効になっていたり、画像の読み込み中にエラーが発生した場合の代替テキストでもあります。

`alt`プロパティには、[ページの意味を変えることなく](https://html.spec.whatwg.org/multipage/images.html#general-guidelines)画像を置き換えることができるテキストを記述する必要があります。画像を補足するためのものではなく、画像の上や下のキャプションですでに提供されている情報を繰り返してはいけません。

画像が[純粋に装飾的](https://html.spec.whatwg.org/multipage/images.html#a-purely-decorative-image-that-doesn't-add-any-information)であったり、[ユーザー向けでない](https://html.spec.whatwg.org/multipage/images.html#an-image-not-intended-for-the-user)場合は、`alt`プロパティは空の文字列（`alt=""`）にする必要があります。

[さらに学ぶ →](https://html.spec.whatwg.org/multipage/images.html#alt)

## 任意の Props

`<Image />`コンポーネントは、必須属性以外にも多くの負荷的な属性を受け付けます。このセクションでは、Image コンポーネントのもっとも一般的に使用されるプロパティについて説明します。めったに使われない属性については、[高度な属性](#高度な属性)のセクションで詳細をご覧ください。

### `loader`

画像 URL の解決に使用されるカスタム関数です。

`loader`は、以下のパラメータを受け取り、画像の URL 文字列を返す関数です：

- [`src`](#src)
- [`width`](#width)
- [`quality`](#quality)

カスタムの`loader`の例は以下のようなものです：

```jsx
'use client'

import Image from 'next/image'

const imageLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

export default function Page() {
  return (
    <Image
      loader={imageLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

> **Good to know**： `loader`のような関数を受け付ける prop を使用する場合、提供された関数をシリアライズするために[Client Components](/docs/app-router/building-your-application/rendering/client-components)を使用する必要があります。

あるいは`next.config.js`の[`loaderFile`](#loaderfile)設定を使用して、アプリケーション内の`next/image`のすべてのインスタンスを、prop を渡さずに設定もできます。

### `fill`

```js
fill={true} // {true} | {false}
```

画像が親要素を満たすようにするブール値で、幅と高さが不明な場合に便利です。

親要素は`position: "relative"`、`position："fixed"`、または`position："absolute"`を指定する*必要があります*。

デフォルトでは、img 要素には自動的に`position: "absolute"`が割り当てられます。

画像にスタイルが適用されていない場合、画像はコンテナに合わせて引き伸ばされます。コンテナに合わせてアスペクト比を維持するためにレターボックス化する画像には、`object-fit: "contain"`を設定するほうがよいでしょう。

あるいは、`object-fit: "cover"`にすると、画像はコンテナ全体を満たし、アスペクト比を保つように切り取られます。これを正しく見せるには、`overflow："hidden"`スタイルが親要素に割り当てられていなければなりません。

詳細は以下を参照してください

- [`position`](https://developer.mozilla.org/docs/Web/CSS/position)
- [`object-fit`](https://developer.mozilla.org/docs/Web/CSS/object-fit)
- [`object-position`](https://developer.mozilla.org/docs/Web/CSS/object-position)

### `sizes`

メディアクエリに似た文字列で、異なるブレイクポイントにおける画像の幅に関する情報を提供します。`sizes`の値は、[`fill`](#fill)を使用している画像や、[レスポンシブサイズを持つようにスタイルされている](#レスポンシブ画像)画像のパフォーマンスに大きく影響します。

`sizes`は、画像描画性能に関連する 2 つの重要な目的を果たします：

- まず、ブラウザは、`next/image`が自動的に生成した`srcset`から、ダウンロードする画像のサイズを決定するために`sizes`の値を使用します。ブラウザが画像を選択するとき、ページ上の画像のサイズをまだ知らないので、ビューポートと同じサイズかそれより大きい画像を選択します。`sizes`属性を使用すると、画像が実際にはフルスクリーンよりも小さくなることをブラウザに伝えることができます。`fill`属性で画像の`sizes`値を指定しない場合、デフォルト値の`100vw`（フルスクリーン幅）が使用されます。
- 次に、`sizes`属性は自動生成され`srcset`値の動作を変更します。`sizes`値がない場合、固定サイズの画像（1x/2x/など）に適した小さな`srcset`が生成されます。`sizes`が定義されている場合、レスポンシブ画像に適した大きな`srcset`が生成されます（640w/750w など）。`sizes`属性にビューポート幅のパーセンテージを表す`50vw`のようなサイズが含まれている場合、`srcset`は必要以上に小さい値を含まないようにトリミングされます。

例えばスタイリングによって画像がモバイルデバイスでは全幅、タブレットでは 2 カラム、デスクトップでは 3 カラムのレイアウトになることがわかっている場合、`sizes`属性は次のようにします：

```jsx
import Image from 'next/image'

export default function Page() {
  return (
    <div className="grid-element">
      <Image
        fill
        src="/example.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

この`sizes`の例では、パフォーマンス指標に劇的な影響を与えます。`33vw`のサイズがなければ、サーバーから選択される画像は必要な幅の 3 倍になってしまいます。ファイルサイズは横幅の 2 乗に比例するため、サイズがなければユーザーは必要なサイズの 9 倍の画像をダウンロードすることになります。

`srcset`、`sizes`の詳細は以下を参照してください：

- [web.dev](https://web.dev/learn/design/responsive-images/#sizes)
- [mdn](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes)

### `quality`

```js
quality={75} // {number 1-100}
```

最適化された画像の画質を表し、`1`から`100`の整数で、`100`を指定すると最高画質、したがってファイルサイズは最大になります。デフォルトは`75`です。

### `priority`

```js
priority={false} // {false} | {true}
```

`true`の場合、画像は優先度が高いとみなされ、[プリロード](https://web.dev/preload-responsive-images/)されます。`priority`を使用している画像では、遅延読み込みは自動的に無効になります。

`priority`属性は[Largest Contentful Paint（LCP）](https://nextjs.org/learn/seo/web-performance/lcp)要素として検出された画像に使用するべきです。異なるビューポートサイズでは異なる画像が LCP 要素になる可能性があるため、複数の優先度画像を持つことが適切な場合もあります。

画像がファースト・ビューに表示される場合にのみ使用されるべきです。デフォルトは`false`です。

### `placeholder`

```js
placeholder = 'empty' // "empty" | "blur" | "data:image/..."
```

画像の読み込み中に使用するプレースホルダを指定します。指定できる値は`blur`、`empty`、または`data:image/...`です。デフォルトは`empty`です。

`blur`の場合、[`blurDataURL`](#blurdataurl)属性がプレースホルダとして使用されます。`src`が[静的インポート](/docs/app-router/building-your-application/optimizing/images#ローカルの画像)からのオブジェクトで、インポートされた画像がアニメーションでないと検知され、`.jpg`、`.png`、`.webp`、または`.avif`の場合、`blurDataURL`は自動的に入力されます。

動的画像の場合は、[`blurDataURL`](#blurdataurl)属性を指定する必要があります。[Plaiceholder](https://github.com/joe-bell/plaiceholder)のようなソリューションでは、`base64`生成に役立ちます。

`data:image/...`の場合、画像がロードされている間、[Data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)がプレースホルダとして使用されます。

`empty`の場合、画像の読み込み中にプレースホルダは無く、空白のスペースだけが表示されます。

以下のリンクから動作を試すことができます：

- [`blur`のデモ](https://image-component.nextjs.gallery/placeholder)
- [`placeholder`に Data URL を使用した shimmer 効果のデモ](https://image-component.nextjs.gallery/shimmer)
- [`blurDataUrl`属性を使用した色効果のデモ](https://image-component.nextjs.gallery/color)

## 高度な属性

場合によっては、より高度な使い方が必要になるかもしれません。`<Image />`コンポーネントは、オプションで以下の高度な属性を受け付けます。

### `style`

基礎となる画像要素に CSS スタイルを渡します。

```jsx title="components/ProfileImage.js"
const imageStyle = {
  borderRadius: '50%',
  border: '1px solid #fff',
}

export default function ProfileImage() {
  return <Image src="..." style={imageStyle} />
}
```

必須の`width`、`height` props はスタイリングと相互作用することがあることを覚えておいてください。スタイリングを使って画像の幅を変更する場合、その画像の本来の縦横比を維持するために高さも`auto`にスタイリングする必要があります。

### `onLoadingComplete`

```jsx
'use client'

<Image onLoadingComplete={(img) => console.log(img.naturalWidth)} />
```

画像が完全に読み込まれ、[プレースホルダ](#placeholder)が削除されると呼び出されるコールバック関数です。

コールバック関数は基礎となる`<img>`要素への参照を引数にとり呼び出されます。

> **Good to know**：`onLoadingComplete`のような関数を受け付ける props を使用する場合、引数に渡される関数をシリアライズするために[Client Components](/docs/app-router/building-your-application/rendering/client-components)を使用する必要があります。

### `onLoad`

```jsx
<Image onLoad={(e) => console.log(e.target.naturalWidth)} />
```

画像がロードされたときに呼び出されるコールバック関数です。

`load`イベントは、画像のプレースホルダが削除され、画像が完全にデコードされる前に発生する場合があります。画像が完全に読み込まれるまで待ちたい場合は、代わりに[`onLoadingComplete`](#onloadingcomplete) を使用します。

> **Good to know**：`onLoad`のような関数を受け付ける props を使用する場合、引数に渡される関数をシリアライズするために[Client Components](/docs/app-router/building-your-application/rendering/client-components)を使用する必要があります。

### `onError`

```jsx
<Image onError={(e) => console.error(e.target.id)} />
```

画像の読み込みが失敗した場合に呼び出されるコールバック関数です。

> **Good to know**：`onError`のような関数を受け付ける props を使用する場合、引数に渡される関数をシリアライズするために[Client Components](/docs/app-router/building-your-application/rendering/client-components)を使用する必要があります。

### `loading`

> 推奨：このプロパティは高度なユースケースを想定しています。`eager`でロードする画像を切り替えると、通常はパフォーマンスが低下します。代わりに[`priority`](#priority)属性を使用することをお勧めします。

```js
loading = 'lazy' // {lazy} | {eager}
```

画像の読み込み動作を指定します。デフォルトは`lazy`です。

`lazy`の場合、ビューポートから計算された距離に達するまで画像の読み込みを延期します。

`eager`の場合、画像を直ちに読み込みます。

`loading`属性の詳細については、[こちら](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-loading)を参照してださい。

### `blurDataURL`

<!-- textlint-disable -->

`src`画像が正常に読み込まれる前にプレースホルダ画像として使用される[Data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs)です。`placeholder="blur"`と組み合わせた場合のみ有効です。

base64 エンコードされた画像でなければなりません。拡大されてぼかされるので、非常に小さい画像（10px 以下）を推奨します。プレースホルダとして大きな画像を含めると、アプリケーションのパフォーマンスが低下する可能性があります。

<!-- textlint-enable -->

以下のリンクから動作を試すことができます：

- [デフォルトの`blurDataURL`のデモ](https://image-component.nextjs.gallery/placeholder)
- [色効果を使用した`blurDatURL`のデモ](https://image-component.nextjs.gallery/color)

また画像にマッチした[単色の Data URL を生成する](https://png-pixel.com/)こともできます。

### `unoptimized`

```js
unoptimized = {false} // {false} | {true}
```

`true`にすると、ソース画像は画質やサイズやフォーマットを変えずにそのまま提供されます。デフォルトは`false`です。

```jsx
import Image from 'next/image'

const UnoptimizedImage = (props) => {
  return <Image {...props} unoptimized />
}
```

Next.js 12.3.0 以降では、`next.config.js`を以下の設定で更新することで、すべての画像にこの prop を割り当てることができます：

```js title="next.config.js"
module.exports = {
  images: {
    unoptimized: true,
  },
}
```

### その他の Props

`<Image />`コンポーネントの他の属性は、以下を除いて、その下にある`img`要素へ渡されます：

- `srcSet` - [`deviceSizes`](#devicesizes)を使用してください
- `decoding` - 常に`"async"`になります

## 設定オプション

props に加えて、`next.config.js`で Image コンポーネントを設定できます。以下のオプションがあります：

### `remotePatterns`

悪意のあるユーザーからアプリケーションを保護するため、外部画像を使用するには設定が必要です。これにより、Next.js の Image Optimization API から提供される外部画像は、自分のアカウントの画像だけになります。これらの外部画像は`next.config.js`ファイルの`remotePatterns`プロパティで設定できます：

```js title="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/account123/**',
      },
    ],
  },
}
```

> **Good to know**: 上記の例では、`next/image`の`src`属性は`https://example.com/account123/`から始まることを強制します。その他のプロトコル、ホスト名、ポート、または一致しないパスは、400 Bad Request で応答します。

以下は、`next.config.js`ファイルの`remotePatterns`プロパティの別の例です：

```js title="next.config.js"
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
}
```

> **Good to know**: 上記の例では、`next/image`の`src`属性は`https://img1.example.com`や`https://me.avatar.example.com`、または任意の数のサブドメインから始まることを強制します。その他のプロトコルやホスト名に一致しないパスは、400 Bad Request で応答します。

ワイルドカード・パターンはパス名とホスト名の両方に使用でき、以下の構文を持ちます：

- `*`は単一のパス Segment またはサブドメインにマッチします
- `**`は末尾の任意の数のパス Segment または先頭のサブドメインにマッチします

パターンの途中では、`**`構文は機能しません。

### `domains`

> **注意**： 悪意のあるユーザからアプリケーションを保護するために、`domain`ではなく厳密な[`remotePatterns`](#remotepatterns)を設定することをお勧めします。ドメインから提供されるすべてのコンテンツを所有する場合にのみ、`domain`を使用してください。

[`remotePatterns`](#remotepatterns)と同様に、`domains`を使って外部の画像として許可されるホスト名のリストを指定できます。

しかし、`domains`設定はワイルドカードによるパターンマッチをサポートしておらず、プロトコル、ポート、パス名は制限できません。

以下は、`next.config.js`ファイルの`domains`プロパティの例です：

```js title="next.config.js"
module.exports = {
  images: {
    domains: ['assets.acme.com'],
  },
}
```

### `loaderFile`

<!-- textlint-disable -->

Next.js にビルドインの Image Optimization API ではなく、クラウドプロバイダーを使って画像を最適化したい場合は、`next.config.js`で`loaderFile`を次のように設定します：

<!-- textlint-enable -->

```js title="next.config.js"
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

このファイルは、Next.js アプリケーションのルートからの相対パスで指定する必要があります。このファイルは以下の例のように文字列を返すデフォルト関数をエクスポートする必要があります：

```js
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

あるいは、[`loader` prop](/docs/app-router/api-reference/components/image#loader)を使って`next/image`の各インスタンスを設定できます。

例：

- [カスタムのローダー設定](/docs/app-router/api-reference/next-config-js/images#ローダーの設定例)

> **Good to know**：関数を受け付けるイメージローダーのファイルをカスタマイズするには、[Client Component](/docs/app-router/building-your-application/rendering/client-components)を使用して提供された関数をシリアライズする必要があります。

## 高度な設定

以下の設定は高度なユースケース向けであり、通常は必要ありません。以下の属性を設定すると、今後のアップデートで Next.js のデフォルトが変更されても、それを上書きすることになります。

### `deviceSizes`

ユーザーのデバイス幅がわかっている場合、`next.config.js`の`deviceSizes`プロパティを使用してデバイス幅のブレークポイントのリストを指定できます。これらの幅は、`next/image`コンポーネントが[`sizes`](#sizes) prop を使用するときに使用され、ユーザーのデバイスに対して正しい画像が提供されるようにします。

設定が提供されない場合、以下のデフォルトが使用されます。

```js title="next.config.js"
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### `imageSizes`

`next.config.js`ファイルの`images.imageSizes`プロパティを使用して、画像の幅のリストを指定できます。これらの幅は、[deviceSizes](#devicesizes)の配列と連結され、画像の[srcset](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)を生成するために使用されるサイズの完全な配列を形成します。

2 つの別々のリストがある理由は、imageSizes は、画像が画面の全幅よりも小さいことを示す[`sizes`](#sizes) prop を提供する画像にのみ使用されるからです。**したがって、imageSizes のサイズはすべて deviceSizes の最小サイズより小さくなければなりません。**

設定が提供されていない場合、以下のデフォルトが使用されます。

```js title="next.config.js"
module.exports = {
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
}
```

### `formats`

デフォルトの[Image Optimization API](/docs/app-router/api-reference/components/image#loader)は、リクエストの`Accept`ヘッダによってブラウザがサポートしている画像フォーマットを自動的に検出します。

`Accept`ヘッダが複数の設定済みのフォーマットにマッチした場合は、配列の最初にマッチしたものが使用されます。したがって、配列の順番は重要です。マッチするものがない（あるいは元画像がアニメーションである）場合は、Image Optimization API は元画像のフォーマットにフォールバックします。

設定を省略した場合は、以下のデフォルトが使われます。

```js title="next.config.js"
module.exports = {
  images: {
    formats: ['image/webp'],
  },
}
```

AVIF のサポートは以下の設定で有効にできます。

```js title="next.config.js"
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

> **Good to know**:
>
> - AVIF は一般的にエンコードに 20%長い時間がかかりますが、WebP に比べて 20%小さく圧縮されます。つまり、最初に画像がリクエストされたときは一般的に遅くなり、その後キャッシュされたリクエストは速くなります
> - Next.js の前にプロキシ/CDN を使用してセルフホストする場合は、`Accept`ヘッダーを転送するようにプロキシを設定する必要があります

## キャッシュの制御

以下に、デフォルトの[ローダー](#loader)のキャッシュ・アルゴリズムについて説明します。その他のローダーについては、クラウドプロバイダーのドキュメントを参照してください。

画像はリクエスト時に動的に最適化され、`<distDir>/cache/images`ディレクトリに保存されます。最適化された画像ファイルは、有効期限が切れるまで、それ以降のリクエストで提供されます。キャッシュされているが有効期限切れのファイルにマッチするリクエストがなされると、有効期限切れの画像は直ちに古くなったものが提供されます。その後、画像はバックグラウンドで再度最適化され（再検証とも呼ばれます）、 新しい有効期限とともにキャッシュに保存されます。

画像のキャッシュの状態は、`x-nextjs-cache`レスポンス・ヘッダの値を読み取ることで決定されます。取り得る値は以下のとおりです：

- `MISS` - パスがキャッシュにない（最初の訪問時に最大一度だけ発生する）
- `STALE` - パスはキャッシュにあるが、再検証時間を超えているため、バックグラウンドで更新される
- `HIT` - パスがキャッシュ内にあり、再検証時間を超えていない

<!-- textlint-disable -->

有効期限（というより Max Age）は、[`minimumCacheTTL`](#minimumcachettl)設定またはアップストリームイメージの`Cache-Control`ヘッダーのいずれか大きい方で定義されます。具体的には、`Cache-Control`ヘッダーの`max-age`値が使用されます。`s-maxage`と`max-age`の両方が見つかった場合、`s-maxage`が優先されます。`max-age`は、CDN やブラウザを含む下流のクライアントにも渡されます。

<!-- textlint-enable -->

- [minimumCacheTTL](#minimumcachettl)を設定すると、アップストリーム画像に`Cache-Control`ヘッダが含まれていない場合、またはその値が非常に小さい場合に、キャッシュ期間を長くできます
- [deviceSizes](#devicesizes)と[imageSizes](#imagesizes)を設定して、生成可能なイメージの総数を減らすことができます
- [formats](#formats)を設定して、複数のフォーマットを無効にし、単一の画像フォーマットを優先させることができます

### `minimumCacheTTL`

最適化された画像をキャッシュする TTL（Time to Live）を秒単位で設定できます。多くの場合、ファイルの内容を自動的にハッシュ化し、`Cache-Control`ヘッダを`immutable`にして画像を永久にキャッシュする[静的な画像インポート](/docs/app-router/building-your-application/optimizing/images#ローカルの画像)を使うのがよいでしょう。

```js title="next.config.js"
module.exports = {
  images: {
    minimumCacheTTL: 60,
  },
}
```

最適化された画像の有効期限（というより Max Age）は、`minimumCacheTTL`またはアップストリーム画像の`Cache-Control`ヘッダーのいずれか大きいほうで定義されます。

画像ごとにキャッシュ動作を変更する場合は、アップストリームの画像（例えば`/_next/image`自体ではなく`/some-asset.jpg`）の`Cache-Control`ヘッダを設定できます。

現時点ではキャッシュを無効にする仕組みはないので、`minimumCacheTTL`を低く保つのが最善です。あるいは、手動で[`src`](#src) prop を変更するか、`<distDir>/cache/images`を削除する必要があるかもしれません。

### `disableStaticImages`

デフォルトの動作では、`import icon from './icon.png'`のように静的ファイルをインポートし、それを`src`プロパティに渡すことが可能です。

場合によっては、インポートが異なる動作をすることを期待する他のプラグインと競合するため、この機能を無効にしたいかもしれません。

静的画像のインポートを無効にするには、`next.config.js`で設定します：

```js title="next.config.js"
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```

### `dangerouslyAllowSVG`

<!-- textlint-disable -->

デフォルトの[ローダー](#loader)は、いくつかの理由から SVG 画像を最適化しません。第一に、SVG はベクターフォーマットであり、ロスレスでリサイズできることを意味します。第二に、SVG には HTML/CSS と同じ機能がたくさんあり、適切な[コンテンツ・セキュリティ・ポリシー](/docs/app-router/building-your-application/configuring/content-security-policy)がないと脆弱性につながる可能性があります。

<!-- textlint-enable -->

デフォルトの Image Optimization API で SVG 画像を提供する必要がある場合、`next.config.js`の中で`dangerouslyAllowSVG`を設定できます：

```js title="next.config.js"
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

<!-- textlint-disable -->

さらに、ブラウザに画像をダウンロードさせるために`contentDispositionType`を設定し、さらに画像に埋め込まれたスクリプトの実行を防ぐために`contentSecurityPolicy`を設定することを強くお勧めします。

<!-- textlint-enable -->

## アニメーション画像

デフォルトの[ローダー](#loader)は、アニメーション画像の画像最適化を自動的にバイパスし、画像をそのまま提供します。

アニメーションファイルの自動検出はベストエフォート型で、GIF、APNG、WebP をサポートしています。指定したアニメーション画像に対して明示的に画像最適化をバイパスしたい場合は、[unoptimized](#unoptimized) prop を使ってください。

## レスポンシブ画像

デフォルトで生成される`srcset`は、異なるデバイスのピクセル比をサポートするために、`1x`と`2x`の画像を含んでいます。しかし、ビューポートに合わせて伸縮するレスポンシブな画像をレンダリングしたい場合もあるでしょう。その場合は、`style`（または`className`）と同様に[`sizes`](#sizes)を設定する必要があります。

以下のいずれかの方法で、レスポンシブ画像をレンダリングできます。

### 静的なインポートを使用したレスポンシブ画像

ソース画像が動的でない場合は、静的にインポートしてレスポンシブ画像を作成できます：

```jsx title="components/author.js"
import Image from 'next/image'
import me from '../photos/me.jpg'

export default function Author() {
  return (
    <Image
      src={me}
      alt="Picture of the author"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
    />
  )
}
```

以下のデモで確認できます：

- [ビューポートにレスポンシブな画像のデモ](https://image-component.nextjs.gallery/responsive)

### アスペクト比を使用したレスポンシブ画像

元画像が動的またはリモートの URL の場合、レスポンシブ画像の正しいアスペクト比を設定するために、`width`と`height`も指定する必要があります：

```jsx title="app/page.js"
import Image from 'next/image'

export default function Page({ photoUrl }) {
  return (
    <Image
      src={photoUrl}
      alt="Picture of the author"
      sizes="100vw"
      style={{
        width: '100%',
        height: 'auto',
      }}
      width={500}
      height={300}
    />
  )
}
```

以下のデモで確認できます：

- [ビューポートにレスポンシブな画像のデモ](https://image-component.nextjs.gallery/responsive)

### `fill`を使用したレスポンシブ画像

アスペクト比がわからない場合は、`fill` prop を設定し、`position: relative`を親で設定する必要があります。オプションで、希望するストレッチとクロップの動作に応じて、`object-fit`スタイルを設定できます：

```jsx title="app/page.js"
import Image from 'next/image'

export default function Page({ photoUrl }) {
  return (
    <div style={{ position: 'relative', width: '500px', height: '300px' }}>
      <Image
        src={photoUrl}
        alt="Picture of the author"
        sizes="500px"
        fill
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
```

以下のデモで確認できます：

- [`fill` prop のデモ](https://image-component.nextjs.gallery/fill)

## Theme の検出

ライトモードとダークモードで異なる画像を表示したい場合は、2 つの`<Image>`コンポーネントをラップし、CSS メディアクエリに基づいて正しいほうを表示する新しいコンポーネントを作成できます。

```css title="components/theme-image.module.css"
.imgDark {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .imgLight {
    display: none;
  }
  .imgDark {
    display: unset;
  }
}
```

```jsx title="components/theme-image.tsx"
import styles from './theme-image.module.css'
import Image, { ImageProps } from 'next/image'

type Props = Omit<ImageProps, 'src' | 'priority' | 'loading'> & {
  srcLight: string
  srcDark: string
}

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props

  return (
    <>
      <Image {...rest} src={srcLight} className={styles.imgLight} />
      <Image {...rest} src={srcDark} className={styles.imgDark} />
    </>
  )
}
```

> **Good to know**：`loading="lazy"`のデフォルトの動作は、確実に正しい画像だけをロードします。`priority`や`loading="eager"`は、両方の画像を読み込んでしまうので使えません。その代わり、[`fetchPriority="high"`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/fetchPriority)を使うことができます。

以下のデモで確認できます：

- [ライト/ダークモードの検出のデモ](https://image-component.nextjs.gallery/theme)

## 既知のブラウザバグ

<!-- textlint-disable -->

この`next/image`コンポーネントは、Safari 15.4 以前の古いブラウザでは eager loading にフォールバックする可能性がある、ブラウザネイティブの[遅延ロード](https://caniuse.com/loading-lazy-attr)を使用します。ブラー効果のプレースホルダを使用すると、Safari 12 より前の古いブラウザでは空のプレースホルダにフォールバックします。`width`/`height`が`auto`のスタイルを使用すると、[縦横比を保持しない](https://caniuse.com/mdn-html_elements_img_aspect_ratio_computed_from_attributes)Safari 15 以前の古いブラウザで[レイアウトシフト](https://web.dev/cls/)が発生する可能性があります。詳しくはこちらの[MDN ビデオ](https://www.youtube.com/watch?v=4-d_SoCHeWE)を参照してください。

<!-- textlint-enable -->

- [Safari 15 - 16.3](https://bugs.webkit.org/show_bug.cgi?id=243601) では、読み込み中にグレーのボーダーが表示されます。Safari 16.4 では[この問題が修正されました](https://webkit.org/blog/13966/webkit-features-in-safari-16-4/#:~:text=Now%20in%20Safari%2016.4%2C%20a%20gray%20line%20no%20longer%20appears%20to%20mark%20the%20space%20where%20a%20lazy%2Dloaded%20image%20will%20appear%20once%20it%E2%80%99s%20been%20loaded.)。考えられる解決策：
  <!-- textlint-disable -->
  - CSS の`@supports (font: -apple-system-body) and (-webkit-appearance: none) { img[loading="lazy"] { clip-path: inset(0.6px) } }`を使用する
  <!-- textlint-enable -->
  - 画像がファーストビューにあるなら[`priority`](#priority)を使用する
- [Firefox 67+](https://bugzilla.mozilla.org/show_bug.cgi?id=1556156) で読み込み中に背景が白く表示されます。考えられる解決策：
  - [AVIF `formats`](#formats)を有効にする
  - [`placeholder`](#placeholder)を使用する

## バージョン履歴

| Version    | Changes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v14.0.0`  | `onLoadingComplete` prop と `domains` 設定が非推奨になりました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `v13.4.14` | `placeholder` prop が`data:/image...`に対応。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `v13.2.0`  | `contentDispositionType`設定が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `v13.0.6`  | `ref` prop が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `v13.0.0`  | `next/image`のインポートは`next/legacy/image`にリネームされました。`next/future/image`のインポートが`next/image`にリネームされました。 インポート文を安全に自動的にリネームするための[codemod が提供されています](/docs/app-router/building-your-application/upgrading/codemods#next-image-to-legacy-image)。`<span>`によるラップが廃止されました。 `layout`、`objectFit`、`objectPosition`、`lazyBoundary`、`lazyRoot`props が削除されました。`alt`が必須になりました。`onLoadingComplete`が`img`要素への参照を引数に取るようになりました。ビルトインのローダー設定が廃止されました。 |
| `v12.3.0`  | `remotePatterns`、`unoptimized`設定が安定版になりました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `v12.2.0`  | 実験的な`remotePatterns`と`unoptimized`設定が追加されました。`layout="raw"`が廃止されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `v12.1.1`  | `style` prop が追加されました。 実験的に`layout="raw"`のサポートが追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `v12.1.0`  | `dangerouslyAllowSVG`と`contentSecurityPolicy`設定が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `v12.0.9`  | `lazyRoot` prop が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `v12.0.0`  | `formats`設定が追加されました。<br/>AVIF のサポートが追加されました。<br/>ラッパーが`<div>`から`<span>`へ変更されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `v11.1.0`  | `onLoadingComplete` and `lazyBoundary`が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `v11.0.0`  | `src` prop support for static import.<br/>`placeholder` prop added.<br/>`blurDataURL`が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `v10.0.5`  | `loader` prop が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `v10.0.1`  | `layout` prop が追加されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `v10.0.0`  | `next/image`が導入されました。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
