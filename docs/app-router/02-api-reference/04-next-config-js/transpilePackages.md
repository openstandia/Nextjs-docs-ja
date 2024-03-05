---
title: transpilePackages
description: ローカルパッケージ（モノリポスのようなもの）または外部依存関係（ node_modules ）から依存関係を自動的に変換し、バンドル化します。
---

Next.js は、ローカルパッケージ（モノレポなど）や外部依存関係（`node_modules`）から、依存関係を自動的にトランスパイルしてバンドルできます。これは`next-transpile-modules`パッケージを置き換えるものです。

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}

module.exports = nextConfig
```

## バージョン履歴

| Version   | Changes                                |
| :-------- | :------------------------------------- |
| `v13.0.0` | `transpilePackages` が追加されました。 |
