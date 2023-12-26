---
title: Runtime Config
description: Add client and server runtime configuration to your Next.js app.
---

<!-- TODO: Fix link -->

> **Good to know**: この機能はレガシーであり、[Automatic Static Optimization](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)、[Output File Tracing](https://nextjs.org/docs/pages/api-reference/next-config-js/output#automatically-copying-traced-files)、[React Server Components](/docs/app-router/building-your-application/rendering/server-components)では動作しません。初期化のオーバーヘッドを避けるため、代わりに[環境変数](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)を使用してください。

アプリケーションにランタイム設定を追加するには、`next.config.js`を開き、`publicRuntimeConfig`と`serverRuntimeConfig`を追加します：

```js title="next.config.js"
module.exports = {
  serverRuntimeConfig: {
    // サーバー側でのみ使用可能
    mySecret: 'secret',
    secondSecret: process.env.SECOND_SECRET, // 環境変数を渡す
  },
  publicRuntimeConfig: {
    // サーバーとクライアントの両方で利用可能
    staticFolder: '/static',
  },
}
```

サーバーのランタイム設定は、`serverRuntimeConfig`以下、クライアント側とサーバー側の両方のコードにアクセスできるものは、`publicRuntimeConfig`の下に置きます。

<!-- TODO: Fix link -->

> `publicRuntimeConfig`に依存するページは、`getInitialProps`または`getServerSideProps`を使用するか、アプリケーションに`getInitialProps`を使用した[カスタムアプリケーション](https://nextjs.org/docs/pages/building-your-application/routing/custom-app)を用意し、[自動静的最適化](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)をオプトアウトする必要があります。ランタイム設定は、サーバー側でレンダリングされないページ（またはページ内のコンポーネント）では利用できません。

アプリケーションのランタイム設定にアクセスするには、次のように`next/config`を使用します：

```js
import getConfig from 'next/config'
import Image from 'next/image'

// serverRuntimeConfig と publicRuntimeConfig のみを保持する
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
// サーバーサイドでのみ使用可能
console.log(serverRuntimeConfig.mySecret)
// サーバーサイドとクライアントサイドの両方で利用可能
console.log(publicRuntimeConfig.staticFolder)

function MyImage() {
  return (
    <div>
      <Image
        src={`${publicRuntimeConfig.staticFolder}/logo.png`}
        alt="logo"
        layout="fill"
      />
    </div>
  )
}

export default MyImage
```
