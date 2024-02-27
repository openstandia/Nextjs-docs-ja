---
title: serverActions
description: Next.jsアプリケーションでのServer Actionsの挙動を設定します。
---

Next.jsアプリケーションでの Server Actions の挙動を設定するためのオプションです。

## `allowedOrigins`

Server Actions を呼び出すことができる安全なオリジンドメインのリストを追加します。Next.jsは Server Action のリクエストのオリジンとホストドメインを比較し、CSRF 攻撃を防ぐために一致することを確認します。提供されていない場合、同一のオリジンのみが許可されます。

```js title="next.config.js"
/** @type {import('next').NextConfig} */

module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

## `bodySizeLimit`

デフォルトでは、Server Action に送信されるリクエストボディの最大サイズは 1MB です。これは、大量のデータを解析するためのサーバーリソースの過度な消費、および潜在的な DDoS 攻撃を防ぐためです。

しかしながら、`serverActions.bodySizeLimit` オプションを使用してこの上限を設定できます。バイト数または bytes でサポートされている文字列形式、例えば `1000` 、 `'500kb'` 、または `'3mb'` を指定できます。

```js title="next.config.js"
/** @type {import('next').NextConfig} */

module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}
```

## Server Actionsの有効化 (v13)

Server Actions は Next.js 14 で安定した機能となり、デフォルトで有効化されています。しかし、Next.js の早期バージョンを使用している場合、`experimental.serverActions` を `true` に設定することで有効化します。

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const config = {
  experimental: {
    serverActions: true,
  },
}

module.exports = config
```
