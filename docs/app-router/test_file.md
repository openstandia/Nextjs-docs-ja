---
title: はじめに
description: Next.jsのドキュメンテーションへようこそ。
---

Next.jsのドキュメンテーションへようこそ！

## Next.jsとは何ですか？

Next.jsは、フルスタックのウェブアプリケーションを構築するためのReactフレームワークです。Reactコンポーネントを使用してユーザーインターフェースを構築し、Next.jsを使用して追加の機能と最適化を提供します。

Next.jsは、Reactに必要なツールを、バンドリング、コンパイリングなどを自動で設定して抽象化します。これにより、設定に時間を費やすことなくアプリケーションの構築に集中できます。

あなたが個人開発者であろうと大規模なチームの一員であろうと、Next.jsはあなたが対話型で、動的で、高速なReactアプリケーションを構築するのを支援します。

## 主な機能

Next.jsの主な機能には以下のようなものがあります：

| 機能                                                                  | 説明                                                                                                                                                                                                |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Routing](/docs/app-router/building-your-application/routing)          | レイアウト、ネストしたルーティング、ローディング状態、エラーハンドリングなどをサポートする、サーバーコンポーネントを利用したファイルシステムベースのルーター                                          |
| [Rendering](/docs/app-router/building-your-application/rendering)      | クライアントサイドとサーバーサイドのレンダリングをサポート。Next.jsによるさらなる最適化として、エッジとNode.jsのランタイムでのストリーミングを利用したサーバー上での静的および動的レンダリング |
| [Data Fetching](/docs/app-router/building-your-application/data-fetching) | サーバーコンポーネントでの非同期/待機を使った簡易なデータ取得と、メモ化されたリクエスト、データキャッシングおよび再評価のための拡張`fetch`API                                                     |
| [Styling](/docs/app-router/building-your-application/styling)          | CSSモジュール、Tailwind CSS、CSS-in-JSなど、あなたが好むスタイリング手法へのサポート。                                                                                                                |
| [Optimizations](/docs/app-router/building-your-application/optimizing) | あなたのアプリケーションのCore Web Vitalsとユーザーエクスペリエンスを向上させるための、画像、フォント、スクリプトの最適化。                                                                          |
| [TypeScript](/docs/app-router/building-your-application/configuring/typescript) | チェックおよびコンパイルの効率化、カスタムTypeScriptプラグインとタイプチェッカーなど、TypeScriptへのさらに進んだサポート。                                                                            |

## ドキュメンテーションの使い方

画面の左側にはドキュメントのナビゲーションバーがあります。ドキュメントのページは順序立てて組織化されており、基本から高度な内容まで、アプリケーションを構築する際には一歩ずつ進めて読むことができます。ただし、任意の順番で読むことも、あなたのユースケースに適用するページに直接スキップすることも可能です。

画面の右側には各ページの目次が表示され、ページ内のセクション間を簡単に移動することができます。ページを素早く探すには、ページ上部の検索バー、または検索ショートカット（`Ctrl+K`または `Cmd+K`）を利用できます。

はじめるには、[インストール](/docs/getting-started/installation)ガイドをご覧ください。

## App RouterとPages Router

Next.jsには二つの異なるルーターがあり：App RouterとPages Routerです。App Routerは新しいルーターで、サーバーコンポーネントやストリーミングといったReactの最新の機能を使うことができます。Pages Routerは元々のNext.jsのルーターで、サーバーレンダリングのReactアプリケーションを構築することができ、以前のNext.jsのアプリケーションに対してもサポートが続けられるものです。

サイドバーの上部には、**App Router**と**Pages Router**の機能を切り替えることができるドロップダウンメニューがあります。それぞれのディレクトリに固有の機能があるので、選択されたタブがどちらであるかを把握しておくことが重要です。

ページの上部にあるパンくずリストも、あなたがApp Routerのドキュメントを見ているのか、それともPages Routerのドキュメントを見ているのかを表示します。

## 必要な知識

当ドキュメントは初心者向けに設計されていますが、Next.jsの機能に焦点を合わせた文書を保持するためには、ある程度の基礎知識が必要です。新しい概念を紹介するたびに、関連するドキュメンテーションへのリンクを提供するようにします。

当ドキュメントから最大限の利益を得るためには、HTML、CSS、Reactの基本的な理解が推奨されます。Reactのスキルを磨きたい場合は、[React基礎コース](/learn/react-foundations)をご覧いただき、基礎知識の紹介から始めます。その後、[ダッシュボードアプリケーションの構築](/learn/dashboard-app)により、Next.jsについて学んでみてください。

## アクセシビリティ

ドキュメンテーションの閲覧中にスクリーンリーダーを使用する際の最適なアクセシビリティを実現するため、FirefoxとNVDA、またはSafariとVoiceOverの使用をおすすめします。

## コミュニティに参加しましょう

Next.jsに関するどんな質問でも、いつでも[GitHub Discussions](https://github.com/vercel/next.js/discussions)、[Discord](https://discord.com/invite/bUG2bvbtHy)、[Twitter](https://x.com/nextjs)、[Reddit](https://www.reddit.com/r/nextjs)上の当コミュニティにお尋ねいただけます。