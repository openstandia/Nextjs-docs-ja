---
title: Next.jsのプロジェクト構成
nav_title: Project Structure
description: Next.js プロジェクトのフォルダとファイル規約のリスト
---

このページでは、Next.js プロジェクトのファイルおよびフォルダー構造の概要を説明します。トップレベルのファイルやフォルダ、設定ファイル、そして `app` ディレクトリと `pages` ディレクトリ内のルーティング規約について説明します。

## トップレベルフォルダ

|                                                                                 |                                                |
| ------------------------------------------------------------------------------- | ---------------------------------------------- |
| [`app`](/docs/app-router/building-your-application/routing)                     | App Router                                     |
| [`pages`](https://nextjs.org/docs/pages/building-your-application/routing)      | Pages Router                                   |
| [`public`](/docs/app-router/building-your-application/optimizing/static-assets) | 配信される静的アセット                         |
| [`src`](/docs/app-router/building-your-application/configuring/src-directory)   | （オプション）アプリケーションのソースフォルダ |

## トップレベルファイル

|                                                                                                    |                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------- |
| **Next.js**                                                                                        |                                        |
| [`next.config.js`](/docs/app-router/api-reference/next-config-js/)                                 | Next.js の設定ファイル                 |
| [`package.json`](/docs/app-router/getting-started/installation)                                    | プロジェクトの依存関係およびスクリプト |
| [`instrumentation.ts`](/docs/app-router/building-your-application/optimizing/instrumentation)      | OpenTelemetry と Instrumentation       |
| [`middleware.ts`](/docs/app-router/building-your-application/routing/middleware)                   | Next.js のリクエスト Middleware        |
| [`.env`](/docs/app-router/building-your-application/configuring/environment-variables)             | 環境変数                               |
| [`.env.local`](/docs/app-router/building-your-application/configuring/environment-variables)       | ローカル環境変数                       |
| [`.env.production`](/docs/app-router/building-your-application/configuring/environment-variables)  | プロダクション環境変数                 |
| [`.env.development`](/docs/app-router/building-your-application/configuring/environment-variables) | 開発環境変数                           |
| [`.eslintrc.json`](/docs/app-router/building-your-application/configuring/eslint)                  | ESLint の設定ファイル                  |
| `.gitignore`                                                                                       | Git が無視するファイルやフォルダの定義 |
| `.next-env.d.ts`                                                                                   | Next.js の TypeScript 定義ファイル     |
| `tsconfig.json`                                                                                    | TypeScript 用の設定ファイル            |
| `jsconfig.json`                                                                                    | JavaScript 用の設定ファイル            |

## `app` Routing の規則

### Routing Files

|                                                                                        |                     |                                       |
| -------------------------------------------------------------------------------------- | ------------------- | ------------------------------------- |
| [`layout`](/docs/app-router/api-reference/file-conventions/layout)                     | `.js` `.jsx` `.tsx` | layout                                |
| [`page`](/docs/app-router/api-reference/file-conventions/page)                         | `.js` `.jsx` `.tsx` | page                                  |
| [`loading`](/docs/app-router/api-reference/file-conventions/loading)                   | `.js` `.jsx` `.tsx` | ローディング UI                       |
| [`not-found`](/docs/app-router/api-reference/file-conventions/not-found)               | `.js` `.jsx` `.tsx` | Not found UI                          |
| [`error`](/docs/app-router/api-reference/file-conventions/error)                       | `.js` `.jsx` `.tsx` | エラー UI                             |
| [`global-error`](/docs/app-router/api-reference/file-conventions/error#global-errorjs) | `.js` `.jsx` `.tsx` | Global エラー UI                      |
| [`route`](/docs/app-router/api-reference/file-conventions/route)                       | `.js` `.ts`         | API エンドポイント                    |
| [`template`](/docs/app-router/api-reference/file-conventions/template)                 | `.js` `.jsx` `.tsx` | リレンダリングレイアウト              |
| [`default`](/docs/app-router/api-reference/file-conventions/default)                   | `.js` `.jsx` `.tsx` | Parallel route のフォールバックページ |

### Nested Routes

|                                                                                           |                           |
| ----------------------------------------------------------------------------------------- | ------------------------- |
| [`folder`](/docs/app-router/building-your-application/routing/#ルート-segment)            | RouteSegment              |
| [`folder/folder`](/docs/app-router/building-your-application/routing/#ネストされたルート) | ネストされた RouteSegment |

### Dynamic Routes

|                                                                                                                         |                            |
| ----------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| [`[folder]`](/docs/app-router/building-your-application/routing/dynamic-routes#規約)                                    | Dynamic route Segment      |
| [`[...folder]`](/docs/app-router/building-your-application/routing/dynamic-routes#キャッチオール-segment)               | Catch-all Segment          |
| [`[[...folder]]`](/docs/app-router/building-your-application/routing/dynamic-routes#オプションのキャッチオール-segment) | Optional catch-all Segment |

### Route Groups と Private Folders

|                                                                                                 |                                                           |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| [`(folder)`](/docs/app-router/building-your-application/routing/route-groups#規約)              | ルーティングに影響を与えずにルートをグループ化する        |
| [`_folder`](/docs/app-router/building-your-application/routing/colocation#プライベートフォルダ) | フォルダーとすべての子 Segment をルーティングから除外する |

### Parallel と Intercepted Routes

|                                                                                                 |                            |
| ----------------------------------------------------------------------------------------------- | -------------------------- |
| [`@folder`](/docs/app-router/building-your-application/routing/parallel-routes#規約)            | Named slot                 |
| [`(.)folder`](/docs/app-router/building-your-application/routing/intercepting-routes#規約)      | 同階層の Intercept         |
| [`(..)folder`](/docs/app-router/building-your-application/routing/intercepting-routes#規約)     | 1 つうえの階層の Intercept |
| [`(..)(..)folder`](/docs/app-router/building-your-application/routing/intercepting-routes#規約) | 2 つうえの階層の Intercept |
| [`(...)folder`](/docs/app-router/building-your-application/routing/intercepting-routes#規約)    | ルートからの Intercept     |

### メタデータファイル規約

#### App Icons

|                                                                                                                              |                                     |                                           |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------- |
| [`favicon`](/docs/app-router/api-reference/file-conventions/metadata/app-icons#favicon)                                      | `.ico`                              | ファビコンファイル                        |
| [`icon`](/docs/app-router/api-reference/file-conventions/metadata/app-icons#icon)                                            | `.png` `.svg`                       | アプリアイコンファイル                    |
| [`icon`](/docs/app-router/api-reference/file-conventions/metadata/app-icons#アイコンを生成するコードを使用するjststsx)       | `.ico` `.jpg` `.jpeg` `.png` `.svg` | 生成されたアプリアイコン                  |
| [`apple-icon`](/docs/app-router/api-reference/file-conventions/metadata/app-icons#apple-icon)                                | `.jpg` `.jpeg`, `.png`              | Apple のアプリアイコンファイル            |
| [`apple-icon`](/docs/app-router/api-reference/file-conventions/metadata/app-icons#アイコンを生成するコードを使用するjststsx) | `.js` `.ts` `.tsx`                  | 生成された Apple のアプリアイコンファイル |

#### Open Graph とツイッター画像

|                                                                                                                                         |                              |                                      |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------ |
| [`opengraph-image`](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image#opengraph-image)                           | `.jpg` `.jpeg` `.png` `.gif` | Open Graph の画像ファイル            |
| [`opengraph-image`](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image#アイコンを生成するコードを使用するjststsx) | `.js` `.ts` `.tsx`           | 生成された Open Graph の画像ファイル |
| [`twitter-image`](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image#twitter-image)                               | `.jpg` `.jpeg` `.png` `.gif` | Twitter 画像ファイル                 |
| [`twitter-image`](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image#アイコンを生成するコードを使用するjststsx)   | `.js` `.ts` `.tsx`           | 生成された Twitter 画像ファイル      |

#### SEO

|                                                                                                      |             |                        |
| ---------------------------------------------------------------------------------------------------- | ----------- | ---------------------- |
| [`sitemap`](/docs/app-router/api-reference/file-conventions/metadata/sitemap#静的なsitemapxml)       | `.xml`      | サイトマップファイル   |
| [`sitemap`](/docs/app-router/api-reference/file-conventions/metadata/sitemap#サイトマップを生成する) | `.js` `.ts` | 生成されたサイトマップ |
| [`robots`](/docs/app-router/api-reference/file-conventions/metadata/robots#静的なrobotstxt)          | `.txt`      | Robots file            |
| [`robots`](/docs/app-router/api-reference/file-conventions/metadata/robots#robotsファイルを生成する) | `.js` `.ts` | 生成された Robots file |

## `pages` のルーティング規則

### 特殊ファイル

|                                                                                                                               |                     |                       |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------- |
| [`_app`](https://nextjs.org/docs/pages/building-your-application/routing/custom-app)                                          | `.js` `.jsx` `.tsx` | カスタムの App        |
| [`_document`](https://nextjs.org/docs/pages/building-your-application/routing/custom-document)                                | `.js` `.jsx` `.tsx` | カスタムの Document   |
| [`_error`](https://nextjs.org/docs/pages/building-your-application/routing/custom-error#more-advanced-error-page-customizing) | `.js` `.jsx` `.tsx` | カスタムの Error Page |
| [`404`](https://nextjs.org/docs/pages/building-your-application/routing/custom-error#404-page)                                | `.js` `.jsx` `.tsx` | 404 Error Page        |
| [`500`](https://nextjs.org/docs/pages/building-your-application/routing/custom-error#500-page)                                | `.js` `.jsx` `.tsx` | 500 Error Page        |

### Routes

|                                                                                                                  |                     |                  |
| ---------------------------------------------------------------------------------------------------------------- | ------------------- | ---------------- |
| **フォルダ規約**　                                                                                               |                     |                  |
| [`index`](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#index-routes)　      | `.js` `.jsx` `.tsx` | ホームページ     |
| [`folder/index`](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#index-routes) | `.js` `.jsx` `.tsx` | ネストしたページ |
| **ファイル規約**　                                                                                               |                     |                  |
| [`index`](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#index-routes)　      | `.js` `.jsx` `.tsx` | ホームページ     |
| [`file`](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)　                    | `.js` `.jsx` `.tsx` | ネストしたページ |

### Dynamic Routes

|                                                                                                                                     |                     |                            |
| ----------------------------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------- |
| **フォルダ規約**                                                                                                                    |                     |                            |
| [`[folder]/index`](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes)                                  | `.js` `.jsx` `.tsx` | Dynamic route Segment      |
| [`[...folder]/index`](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments)            | `.js` `.jsx` `.tsx` | Catch-all Segment          |
| [`[[...folder]]/index`](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments) | `.js` `.jsx` `.tsx` | Optional catch-all Segment |
| **ファイル規約**                                                                                                                    |                     |                            |
| [`[file]`](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes)                                          | `.js` `.jsx` `.tsx` | Dynamic route Segment      |
| [`[...file]`](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments)                    | `.js` `.jsx` `.tsx` | Catch-all Segment          |
| [`[[...file]]`](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments)         | `.js` `.jsx` `.tsx` | Optional catch-all Segment |
