---
title: ルーティングの基礎
nav_title: ルーティング
description: フロントエンドアプリケーションのルーティングの基礎を学びます。
---

すべてのアプリケーションの骨格になるのがルーティングです。このページでは、Webのためのルーティングの **基本的な概念** と Next.js でのルーティングの取り扱いについて紹介します。

## 用語

まず、ドキュメント全体で使用されている以下の用語を理解しておきましょう。

![コンポーネントツリーに関する用語](../../assets/terminology-component-tree.avif)

- **ツリー:** 階層構造を視覚化するための規約。例えば、親コンポーネントと子コンポーネントから成るコンポーネントツリーやフォルダ構造などがあります。
- **サブツリー:** ツリーの一部で、新しいルート（最初）から葉（最後）までの部分です。
- **ルート:** ツリーまたはサブツリーの最初のノード、例えばルートレイアウトです。
- **葉:** 子のないサブツリー内のノード、例えばURLパスの最後の Segmentです。

![URL の構造に関する用語](../../assets/terminology-url-anatomy.avif)

- **URL Segment:** スラッシュによって区切られたURLパスの一部。
- **URL パス:** ドメイン名の後に来るURLの一部（Segment で構成）。

## `app` Router

バージョン 13 から Next.js は新しい **App Router** を導入しました。これは [React Server Components](/docs/app-router/building-your-application/rendering/server-components) をもとにして、共有レイアウト、入れ子になったルーティング、ローディング状態、エラーハンドリングなどをサポートしています。

App Router は新たに作成された `app` ディレクトリで動作します。`app` ディレクトリは `pages` ディレクトリと並行して動作し、漸進的に導入できるようになっています。これにより、アプリケーションの一部のルートを新しい App Router に組み込むことができ、他のルートは `pages` ディレクトリのまま従来の挙動を維持できます。`pages` ディレクトリを使っている場合は、[Pages Router](https://nextjs.org/docs/pages/building-your-application/routing) のドキュメンテーションもあわせて参照してください。

> **Good to know:** App Router はPages Router よりも優先されます。ディレクトリ間のルートは同じURLパスに解決されないよう、衝突を防ぐためにビルド時にエラーを発生させます。

![Next.js App Directory](../../assets/next-router-directories.avif)

デフォルトでは、`app` 内のコンポーネントは [React Server Components](/docs/app-router/building-your-application/rendering/server-components) です。これはパフォーマンスの最適化であり、簡単に採用できるようになっています。また [Client Components](/docs/app-router/building-your-application/rendering/client-components) も使用できます。

> **Recommendation:** Server Components が初めての場合は、[Server Components](/docs/app-router/building-your-application/rendering/server-components) のページを参照してください。

## フォルダとファイルの役割

Next.js はファイルシステムベースの Router を採用しています:

- **フォルダ** はルートを定義するために使用されます。ルートは、最初の **ルートフォルダ** から最終的な **葉フォルダ** に至る、ネストされたフォルダの単一のパスで、`page.js` ファイルが含まれている必要があります。詳細は[ルートの定義](/docs/app-router/building-your-application/routing/defining-routes) を参照してください。
- **ファイル** は、ルート Segment に対する UI を作成するために使用されます。詳細は[ファイル規約](#ファイル規約) を参照してください。

## ルート Segment

ルートの各フォルダは **ルート Segment** を表します。各ルート Segmentは、**URLパス** の対応する **Segment** にマッピングされます。

![ルート Segment とURL Segment の対応関係](../../assets/route-segments-to-path-segments.avif)

## ネストされたルート

ネストされたルートを作成するには、フォルダを互いにネストします。例えば、`app` ディレクトリに 2 つの新しいフォルダをネストすることで、新しい `/dashboard/settings` ルートを追加できます。

`/dashboard/settings`ルートは3つのSegmentで構成されています:

- `/`（ルート Segment）
- `dashboard`（Segment）
- `settings`（葉 Segment）

## ファイル規約

Next.js は、ネストされたルートで特定の振る舞いを持った UI を作成するための一連の特殊なファイルを提供しています:

|                                                                                                 |                                                                                                           |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [`layout`](/docs/app-router/building-your-application/routing/pages-and-layouts#レイアウト)     | Segment とその子コンポーネントで共有する UI                                                               |
| [`page`](/docs/app-router/building-your-application/routing/pages-and-layouts#ページ)           | ルートのユニークな UI を作成し、ルートを公開する                                                          |
| [`loading`](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)        | Segment とその子コンポーネントのローディング UI                                                           |
| [`not-found`](/docs/app-router/api-reference/file-conventions/not-found)                        | Segment とその子コンポーネントが無かった場合の UI                                                         |
| [`error`](/docs/app-router/building-your-application/routing/error-handling)                    | Segment とその子コンポーネントのエラー UI                                                                 |
| [`global-error`](/docs/app-router/building-your-application/routing/error-handling)             | グローバルなエラー UI                                                                                     |
| [`route`](/docs/app-router/building-your-application/routing/route-handlers)                    | サーバーサイドの API エンドポイント                                                                       |
| [`template`](/docs/app-router/building-your-application/routing/pages-and-layouts#テンプレート) | 再レンダリングされる特殊なレイアウト UI                                                                   |
| [`default`](/docs/app-router/api-reference/file-conventions/default)                            | [Parallel Routes](/docs/app-router/building-your-application/routing/parallel-routes) のフォールバック UI |

> **Good to know:** `.js`、`.jsx`、または .`.tsx` の拡張子が使用可能です。

## コンポーネントの階層

ルート Segment のファイルで定義された React コンポーネントは、特定の階層でレンダリングされます:

- `layout.js`
- `template.js`
- `error.js` (React エラーバウンダリー)
- `loading.js` (React サスペンスバウンダリー)
- `not-found.js` (React エラーバウンダリー)
- `page.js` またはネストされた `layout.js`

![ファイル規約によるコンポーネント階層の例](../../assets/file-conventions-component-hierarchy.avif)

ネストされたルートでは、Segmentのコンポーネントは親Segmentのコンポーネントの**内部**にネストされます。

![ネストしたファイル規約によるコンポーネント階層の例](../../assets/nested-file-conventions-component-hierarchy.avif)

## コロケーション

特殊ファイルに加えて、`app` ディレクトリ内のフォルダに独自のファイル（例えば、コンポーネント、スタイル、テストなど）を配置するオプションもあります。

これは、フォルダがルートを定義する一方で、`page.js` や `route.js` によって返される内容だけが公開されアクセスできるからです。

![コロケーションされたファイルを含むフォルダ構造の例](../../assets/project-organization-colocation.avif)

詳細は[プロジェクト編成とファイル・コロケーション](/docs/app-router/building-your-application/routing/colocation)を参照してください。

## 高度なルーティングパターン

App Router では、より高度なルーティングパターンを実装するための一連の規約も提供しています。これには以下が含まれます:

- [Parallel Routes](/docs/app-router/building-your-application/routing/parallel-routes): 2 つまたはそれ以上のページを同時に表示し、独立してナビゲートできるようにします。これらは、独自のサブナビゲーションを持つスプリットビューに使用できます。 例えば、ダッシュボードなどです。
- [Intercepting Routes](/docs/app-router/building-your-application/routing/intercepting-routes): ルートをインターセプトし、別のルートのコンテキストで表示できます。現在のページのコンテキストを保持することが重要な場合にこれらを使用できます。 例えば、タスクを編集しながらすべてのタスクを表示したり、フィード内の写真を拡大したりする場合などです。

これらのパターンを使用すると、小さなチームや個別の開発者では実装するのが難しかった機能を民主化し、リッチで複雑な UI を構築できます。

## 次のステップ

Next.js のルーティングの基本を理解したら、以下のリンクをたどって最初のルートを作成しましょう:

- [ルートの定義](/docs/app-router/building-your-application/routing/defining-routes) Next.js ではじめてルートを作成する方法を学びます。
- [ページとレイアウト](/docs/app-router/building-your-application/routing/pages-and-layouts) App Router ではじめてページと共有レイアウトを作成します。
- [リンクとナビゲート](/docs/app-router/building-your-application/routing/linking-and-navigating) Next.js でナビゲーションがどのように機能するのか、Link コンポーネントと `useRouter` フックの使い方を学びます。
- [ロードUIとストリーミング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming) Susppense の上に構築されたローディング UI は、特定のルート Segment 用のフォールバックを作成し、準備が整ったコンテンツを自動的にストリームできます。
- [Error Handling](/docs/app-router/building-your-application/routing/error-handling) ルート Segment とそのネストした子要素を React Error Boundary で自動的にラップすることで、ランタイムエラーを処理します。
- [Redirecting](/docs/app-router/building-your-application/routing/redirecting) Next.js でリダイレクトを処理するさまざまな方法を学びましょう。
- [ルートグループ](/docs/app-router/building-your-application/routing/route-groups) Route グループは、Next.js アプリケーションをさまざまなセクションへ分割するために使用できます。
- [プロジェクト編成](/docs/app-router/building-your-application/routing/colocation) Next.js プロジェクトを整理し、ファイルを配置する方法を学びます。
- [Dynamic Routes](/docs/app-router/building-your-application/routing/dynamic-routes) Dynamic Routesは、動的なデータからルート Segment をプログラムで生成するために使用できる。
- [Parallel Routes](/docs/app-router/building-your-application/routing/parallel-routes) 独立してナビゲートできる 1 つまたは複数のページを、同じビューで同時にレンダリングする、非常に動的なアプリケーション向けのパターンです。
- [Intercepting Routes](/docs/app-router/building-your-application/routing/intercepting-routes) Intercepting Routes を使って、ブラウザの URL をマスキングしながら、現在のレイアウト内で新しいルートを読み込みます。
- [Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) Web の Request API とResponse API を使用して、指定されたルートのカスタムリクエストハンドラを作成します。
- [Middleware](/docs/app-router/building-your-application/routing/middleware) リクエストが完了する前にコードを実行する Middleware の使い方を学日ます。
- [国際化](/docs/app-router/building-your-application/routing/internationalization) 国際化されたルーティングとローカライズされたコンテンツにより、多言語のサポートを追加します。
