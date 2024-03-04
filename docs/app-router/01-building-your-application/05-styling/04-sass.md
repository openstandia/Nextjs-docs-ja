---
title: Sass
description: Sass を使って Next.js アプリケーションをスタイリングします。
---

Sass パッケージをインストールすれば、Next.jsは `.scss` および `.sass` 拡張子のファイルを作ることで、ビルトインで Sass との統合をサポートしています。 `.module.scss` または `.module.sass` 拡張子を用いてコンポーネントレベルの Sass を CSS Modules を通じて使用できます。

まず、[`sass`](https://github.com/sass/sass) をインストールしてください:

```bash title="Terminal"
npm install --save-dev sass
```

> **Good to know**:
>
> Sass は[2種類の異なる構文](https://sass-lang.com/documentation/syntax)をサポートしており、それぞれが独自の拡張子を持っています。
> `.scss` 拡張子では [SCSS構文](https://sass-lang.com/documentation/syntax#scss) を利用する必要があり、
> 一方で `.sass` 拡張子では [インデント構文 ("Sass")](https://sass-lang.com/documentation/syntax#the-indented-syntax) を利用する必要があります。
>
> どちらを使うべきか分からない場合は、CSS のスーパーセットであり、
> インデント構文 ("Sass") を学ぶ必要がない `.scss` 拡張子から始めると良いでしょう。

### Sassオプションのカスタマイズ

Sass コンパイラを設定したい場合は、`next.config.js` で `sassOptions` を使用します。

```js title="next.config.js"
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
```

### Sass変数

Next.js は CSS Modules ファイルからエクスポートされた Sass 変数をサポートしています。

例えば、エクスポートされた `primaryColor` 変数を使用する場合は次のようにします:

```scss title="app/variables.module.scss"
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}
```

```jsx title="app/page.js"
// ルートの '/' URLにマップされる

import variables from './variables.module.scss'
 
export default function Page() {
  return <h1 style={{ color: variables.primaryColor }}>Hello, Next.js!</h1>
}
```