---
title: transpilePackages
description: Automatically transpile and bundle dependencies from local packages (like monorepos) or from external dependencies (`node_modules`).
---

Next.js は、ローカルパッケージ（モノレポなど）や外部依存関係（`node_modules`）から、依存関係を自動的にトランスパイルしてバンドルできます。これは`next-transpile-modules`パッケージを置き換えるものです。

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}

module.exports = nextConfig
```
