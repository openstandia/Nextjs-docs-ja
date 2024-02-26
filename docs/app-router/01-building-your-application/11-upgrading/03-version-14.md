---
title: バージョン 14
description: Next.js アプリケーションをバージョン 13 から 14 にアップグレードします。
---

## 13 から 14 へのアップグレード

Next.js のバージョン 14 にアップデートするためには、お好みのパッケージマネージャを使用して次のコマンドを実行します:

```bash title="Terminal"
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash title="Terminal"
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash title="Terminal"
pnpm up next react react-dom eslint-config-next --latest
```

```bash title="Terminal"
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

> **Good to know:** TypeScript を使用している場合は、`@types/react` と `@types/react-dom` も最新版にアップグレードしてください。

### v14 の要点

- 最低限必要な Node.js のバージョンが 16.14 から 18.17 に上がりました。これは、16.x が廃止予定になったためです。
- `next export` コマンドは `output: 'export'` 置き換えられため、削除されました。詳細は[こちらのドキュメント](/docs/app-router/building-your-application/deploying/static-exports)を参照してください。
- `next/server` の `ImageResponse` のインポートは `next/og` に変更されました。自動で安全にインポートをリネームする [codemod が利用可能](/docs/app-router/building-your-application/upgrading/codemods#next-og-import) です。
- `@next/font` パッケージは完全に削除され、内蔵の `next/font` に置き換えられました。自動で安全にインポートをリネームする [codemod が利用可能](/docs/app-router/building-your-application/upgrading/codemods#built-in-next-font) です。
- `next-swc` の WASM ターゲットは削除されました。