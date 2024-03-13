---
title: env
description: Next.js アプリケーションでビルド時に環境変数を追加およびアクセスする方法を学びます。
sidebar_position: 7
---

> [Next.js 9.4](https://nextjs.org/blog/next-9-4)のリリース以来、環境変数をより直感的かつ人間工学的に[追加できるようになりました](/docs/app-router/building-your-application/configuring/environment-variables)。ぜひお試しください！

<details>
  <summary>例</summary>
	<div>
  <a href="https://github.com/vercel/next.js/tree/canary/examples/with-env-from-next-config-js">With env</a>
	</div>
</details>

> **Good to know**: この方法で指定された環境変数は、**常に**JavaScript バンドルに含まれます。環境変数名の前に`NEXT_PUBLIC_`を付けるのは、環境や`.env`ファイルを通して指定する場合にのみ効果があります。

JavaScript バンドルに環境変数を追加するには、`next.config.js`を開き、`env`設定を追加します：

```js title="next.config.js"
module.exports = {
  env: {
    customKey: 'my-value',
  },
}
```

これで、コード内で`process.env.customKey`へアクセスできるようになります。例えば：

```js
function Page() {
  return <h1>The value of customKey is: {process.env.customKey}</h1>
}

export default Page
```

Next.js はビルド時に`process.env.customKey`を`'my-value'`に置き換えます。webpack の[DefinePlugin](https://webpack.js.org/plugins/define-plugin/)の性質上、`process.env`変数をデストラクチャリングしようとしてもうまくいきません。

例えば、次の行は：

```js
return <h1>The value of customKey is: {process.env.customKey}</h1>
```

次のようになります：

```js
return <h1>The value of customKey is: {'my-value'}</h1>
```
