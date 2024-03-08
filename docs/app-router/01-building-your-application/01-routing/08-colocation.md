---
title: プロジェクト編成とファイル・コロケーション
sidebar_label: プロジェクト編成
description: Learn how to organize your Next.js project and colocate files.
related:
  links:
    - app-router/building-your-application/routing/defining-routes
    - app-router/building-your-application/routing/route-groups
    - app-router/building-your-application/configuring/src-directory
    - app-router/building-your-application/configuring/absolute-imports-and-module-aliases
---

[ルーティングフォルダとファイルの規約](/docs/app-router/getting-started/project-structure#app-routing-conventions)を除けば、Next.js はプロジェクトファイルをどのように整理し、配置するかについて**無論**です。

このページでは、デフォルトの動作と、プロジェクト構成に利用できる機能を紹介します。

- [デフォルトで安全なコロケーション](#デフォルトで安全なコロケーション)
- [プロジェクトの整理機能](#プロジェクトの整理機能)
  - [プライベートフォルダ](#プライベートフォルダ)
  - [ルートグループ](#ルートグループ)
  - [`src` ディレクトリ](#src-ディレクトリ)
  - [モジュールパスのエイリアス](#モジュールパスのエイリアス)
- [プロジェクトの構成戦略](#プロジェクトの構成戦略)
  - [`app` の外側にプロジェクトファイルを保存する](#app-の外側にプロジェクトファイルを保存する)
  - [`app` 内のトップレベルフォルダにプロジェクトファイルを格納する](#app-内のトップレベルフォルダにプロジェクトファイルを格納する)
  - [機能やルートごとにプロジェクトファイルを分割する](#機能やルートごとにプロジェクトファイルを分割する)

## デフォルトで安全なコロケーション

`app`ディレクトリでは、[入れ子になったフォルダ階層](/docs/app-router/building-your-application/routing#ルート-segment)がルート構造を定義します。

それぞれのフォルダは URL パスの対応する Segment にマッピングされるルート Segment を表します。

しかし、ルート構造はフォルダを通して定義されますが、`page.js` または `route.js` ファイルがルート Segment に追加されるまでは、ルートは**パブリックにアクセスできません**。

![A diagram showing how a route is not publically accessible until a page.js or route.js file is added to a route segment.](../../assets/project-organization-not-routable.avif)

またルートが公開されている場合でも、`page.js`または`route.js`が返す**コンテンツ**だけがクライアントに送信されます。

![A diagram showing how page.js and route.js files make routes publically accessible.](../../assets/project-organization-routable.avif)

これは、**プロジェクトファイル** を**安全に** `app`ディレクトリのルート Segment 内に配置できることを意味します。

![A diagram showing colocated project files are not routable even when a segment contains a page.js or route.js file.](../../assets/project-organization-colocation.avif)

> **Good to know:**
>
> - これは `pages` ディレクトリとは異なり、`pages` にあるファイルはすべてルートとみなされます。
> - プロジェクトファイルを `app` ディレクトリに置くことは ** できます** が、 ** する必要はありません** 。もし必要であれば、[`app`ディレクトリの外に置いておくこともできます](#app-の外側にプロジェクトファイルを保存する)。

## プロジェクトの整理機能

Next.js には、プロジェクトの整理に役立ついくつかの機能があります。

### プライベートフォルダ

プライベートフォルダを作成するには、フォルダの前にアンダースコア `_folderName` をつけます。

これは、そのフォルダがプライベートな実装の詳細であり、ルーティングシステムによって考慮されるべきではないことを示し、それによって **フォルダとそのすべてのサブフォルダ** をルーティングから除外します。

![An example folder structure using private folders](../../assets/project-organization-private-folders.avif)

`app`ディレクトリのファイルは[デフォルトで安全にコロケーションできる](#デフォルトで安全なコロケーション)ので、プライベートフォルダはコロケーションには必要ありません。しかし、次のような場合に役立ちます。

- UI ロジックをルーティングロジックから分離する。
- プロジェクトや Next.js エコシステム全体で内部ファイルを一貫して整理する。
- コードエディタでのファイルの並べ替えとグループ化。
- 将来の Next.js ファイル規約との潜在的な名前の衝突を避ける。

> **Good to know:**
>
> - フレームワークの規約ではありませんが、同じアンダースコアのパターンを使って、プライベートフォルダ外のファイルを"private"とマークすることも考えてみてください。
> - フォルダ名の前に `%5F` (アンダースコアの URL エンコード形式) を付けることで、アンダースコアで始まる URL セグメントを作成できます。`%5FfolderName`
> - プライベートフォルダを使用しない場合は、Next.js の[特別なファイル規約](/docs/app-router/getting-started/project-structure#routing-files)を知っておくと、予期せぬ名前の衝突を防ぐことができます。

### ルートグループ

ルートグループはフォルダを括弧で囲むことで作成できます： `(folderName)`
これは、フォルダが整理のためのものであり、ルートの URL パスに**含まれるべきではない**ことを示します。

![An example folder structure using route groups](../../assets/project-organization-route-groups.avif)

ルートグループは次のことに役立ちます：

- [ルートをグループに編成する](/docs/app-router/building-your-application/routing/route-groups#url-パスに影響を与えずにルートを整理する)例えば、サイトセクション、インテント、チームによって。
- 同じルート Segment レベルでネストされたレイアウトを有効にする：
  - [複数のルートレイアウトを含め、同じセグメントで複数のネストされたレイアウトを作成する](/docs/app-router/building-your-application/routing/route-groups#複数のルートレイアウトを作成する)
  - [共通セグメント内のルートのサブセットにレイアウトを追加する](/docs/app-router/building-your-application/routing/route-groups#特定の-segment-をレイアウトに組み込む)

### `src` ディレクトリ

Next.js では、アプリケーションコード（`app`を含む）をオプションの[`src`ディレクトリ](/docs/app-router/building-your-application/configuring/src-directory)に格納できます。これは、プロジェクトのルートにある設定ファイルからアプリケーションコードを分離します。

![An example folder structure with the `src` directory](../../assets/project-organization-src-directory.avif)

### モジュールパスのエイリアス

Next.js は[Module Path Aliases](/docs/app-router/building-your-application/configuring/absolute-imports-and-module-aliases)をサポートしています。これにより、深くネストしたプロジェクト・ファイル間のインポートの読み取りと維持が容易になります。

```tsx title="app/dashboard/settings/analytics/page.js"
// before
import { Button } from '../../../components/button'

// after
import { Button } from '@/components/button'
```

## プロジェクトの構成戦略

Next.js プロジェクトでファイルやフォルダを整理する方法には「正しい」「間違っている」はありません。

次のセクションでは、一般的な戦略について、ごく大まかな概要を説明します。もっとも簡単なのは、自分とチームに合った戦略を選び、プロジェクト全体で一貫性を保つことです。

> **Good to know:** 以下の例では、`components` と `lib` フォルダを一般的なプレースホルダとして使用しています。これらの命名にフレームワークの特別な意味はなく、あなたのプロジェクトでは `ui`、`utils`、`hooks`、`styles` などの他のフォルダを使用するかもしれません。

### `app` の外側にプロジェクトファイルを保存する

この方法では、すべてのアプリケーションコードを **プロジェクトのルート** にある共有フォルダに保存し、`app` ディレクトリは純粋にルーティングのためだけに使用します。

![An example folder structure with project files outside of app](../../assets/project-organization-project-root.avif)

### `app` 内のトップレベルフォルダにプロジェクトファイルを格納する

このストラテジーでは、すべてのアプリケーションコードを **`app` ディレクトリのルート** にある共有フォルダに格納します。

![An example folder structure with project files inside app](../../assets/project-organization-app-root.avif)

### 機能やルートごとにプロジェクトファイルを分割する

この戦略では、グローバルに共有されるアプリケーションコードをルートディレクトリ `app` に保存し、より特定のアプリケーションコードを使用するルート Segment に **分割** します。

![An example folder structure with project files split by feature or route](../../assets/project-organization-app-root-split.avif)
