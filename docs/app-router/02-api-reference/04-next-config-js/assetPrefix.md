---
title: assetPrefix
description: Learn how to use the assetPrefix config option to configure your CDN.
---

> **注意**: [Vercel にデプロイする](/docs/app-router/building-your-application/deploying)と、Next.js プロジェクトはグローバル CDN が自動的に設定されます。手動で Asset Prefix を設定する必要はありません。

> **Good to know**: Next.js 9.5 以降では、カスタマイズ可能な Base Path がサポートされました。`/docs`のようなサブパスにアプリケーションをホスティングするのに適しています。この場合、カスタムの Asset Prefix を使用することはお勧めしません。

[CDN](https://en.wikipedia.org/wiki/Content_delivery_network)を設定するには、アセットの接頭辞を設定し、Next.js がホストされているドメインに解決するように CDN のオリジンを設定します。

`next.config.js`を開き、`assetPrefix`設定を追加します：

```js title="next.config.js"
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  // プロダクションではCDN、開発中はlocalhostを使用する
  assetPrefix: isProd ? 'https://cdn.mydomain.com' : undefined,
}
```

Next.js は、`/_next/`パス（``.next/static/`フォルダ）から読み込む JavaScript ファイルと CSS ファイルに対して、アセットの接頭辞を自動的に使用します。たとえば、上記の設定で、次のような JS チャンクをリクエストします：

```
/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```

上記は、以下のようにリクエストされます：

```
https://cdn.mydomain.com/_next/static/chunks/4b9b41aaa062cbbfeff4add70f256968c51ece5d.4d708494b3aed70c04f0.js
```

特定の CDN にファイルをアップロードするための正確な設定は、選択した CDN によって異なります。CDN でホストする必要がある唯一のフォルダは、`.next/static/`の中で、上記の URL リクエストが示すように`_next/static/`としてアップロードする必要があります。**`next/`フォルダの他のファイルはアップロードしないでください**。サーバーコードやその他の設定を一般に公開すべきではありません。

`assetPrefix`は`_next/static`へのリクエストをカバーしますが、次のパスには影響しません：

<!-- TODO: Fix link -->

- [public](/docs/app-router/building-your-application/optimizing/static-assets)フォルダ内のファイル； これらのアセットを CDN で提供したい場合は、自分で接頭辞を導入する必要があります
