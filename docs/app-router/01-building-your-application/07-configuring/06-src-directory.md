---
title: src ディレクトリ
description: "`src` ディレクトリの下にページを保存すると、ルートの `pages` ディレクトリの代わりになります。"
related:
  links:
    - app-router/building-your-application/routing/colocation
---

Next.js の `app` や `pages` ディレクトリをプロジェクトのルートへ配置する代わりに、`src` ディレクトリの下にアプリケーションのコードを置く一般的なパターンをサポートしています。

これにより、アプリケーションのコードがプロジェクト設定ファイルと分離し、プロジェクト設定ファイルは主にプロジェクトのルートへ配置できます。これは一部の個人やチームが好む方法です。

`src` ディレクトリを使用するには、`app` Router フォルダまたは `pages` Router フォルダを `src/app` または `src/pages` にそれぞれ移動します。

![src ディレクトリを含むフォルダ構造の例](../../assets/project-organization-src-directory.avif)
 
> **Good to know**:
>
> - `/public` ディレクトリはプロジェクトのルートに残す必要があります。
> - `package.json`、`next.config.js`、`tsconfig.json` などの設定ファイルはプロジェクトのルートに残す必要があります。
> - `.env.*` ファイルはプロジェクトのルートに残す必要があります。
> - `src/app` または `src/pages` は、`app` または`pages` がルートディレクトリに存在する場合は無視されます。
> - `src` を使っている場合、おそらく `/components` や `/lib` などの他のアプリケーションフォルダも移動することになるでしょう。
> - Middleware を使っている場合は、`src` ディレクトリ内に配置することを忘れないでください。
> - Tailwind CSS を使用している場合、`tailwind.config.js` ファイルの[content section](https://tailwindcss.com/docs/content-configuration)に `/src` プレフィックスを追加する必要があります。
