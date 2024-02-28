---
title: サポートされているブラウザ
description: Next.js によってサポートされているブラウザと JavaScript の機能
---

Next.js は **モダンブラウザ** をゼロ・コンフィギュレーションでサポートします。

- Chrome 64+
- Edge 79+
- Firefox 67+
- Opera 51+
- Safari 12+

## ブラウザリスト

特定のブラウザや機能をターゲットにしたい場合、Next.js は `package.json` ファイルの [Browserslist](https://browsersl.ist) 設定をサポートしています。
Next.js では、デフォルトで以下のようなブラウザリスト設定になっています:

```json filename="package.json"
{
  "browserslist": [
    "chrome 64",
    "edge 79",
    "firefox 67",
    "opera 51",
    "safari 12"
  ]
}
```

## ポリフィル

私たちは、[広く使われているポリフィル](https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js)を注入します:

- [**fetch()**](https://developer.mozilla.org/docs/Web/API/Fetch_API) — 置換: `whatwg-fetch` と `unfetch`。
- [**URL**](https://developer.mozilla.org/docs/Web/API/URL) — 置換: [`url` パッケージ (Node.js API)](https://nodejs.org/api/url.html)。
- [**Object.assign()**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) — 置換: `object-assign`、`object.assign`、`core-js/object/assign`。

依存関係にこれらのポリフィルが含まれている場合、重複を避けるために本番ビルドから自動的に除外されます。

さらに、バンドルサイズを小さくするために、Next.js はこれらのポリフィルを必要とするブラウザにのみ読み込みます。
グローバルなウェブトラフィックの大部分は、これらのポリフィルをダウンロードしません。

### カスタムポリフィル

もし、あなた自身のコードや外部の npm の依存関係が、ターゲットブラウザでサポートされていない機能 (IE 11 など) を必要とする場合は、あなた自身でポリフィルを追加する必要があります。

この場合、[カスタム `<App>`](https://nextjs.org/docs/pages/building-your-application/routing/custom-app) または個々のコンポーネントに、必要なポリフィルのトップレベルのインポートを追加する必要があります。

## JavaScript 言語の機能

Next.js では、最新の JavaScript 機能をすぐに使うことができます。[ES6 の機能](https://github.com/lukehoban/es6features)に加え、Next.js は以下の機能もサポートしています:

- [Async/await](https://github.com/tc39/ecmascript-asyncawait) (ES2017)
- [Object Rest/Spread Properties](https://github.com/tc39/proposal-object-rest-spread) (ES2018)
- [Dynamic `import()`](https://github.com/tc39/proposal-dynamic-import) (ES2020)
- [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) (ES2020)
- [Nullish Coalescing](https://github.com/tc39/proposal-nullish-coalescing) (ES2020)
- [Class Fields](https://github.com/tc39/proposal-class-fields) と [Static Properties](https://github.com/tc39/proposal-static-class-features) (part of stage 3 proposal)
- などなど！

### TypeScript の機能

Next.jsはTypeScriptをビルトインでサポートしています。詳細は[こちら](/docs/app-router/building-your-application/configuring/typescript)。

### Babel 設定のカスタマイズ (Advanced)

Babel 設定をカスタマイズできます。詳しくは[こちら](https://nextjs.org/docs/pages/building-your-application/configuring/babel)。
