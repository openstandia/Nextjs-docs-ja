---
title: 初めに
description: Learn how to create full-stack web applications with Next.js.
---

# イントロダクション

Next.js のドキュメントへようこそ！

---

## Next.js とは？

Next.js は フルスタックの Web アプリケーションを構築するための React フレームワークです。ユーザーインターフェイスの構築には React Components を使用し、追加機能や最適化には Next.js を使用します。

さらに Next.js は、バンドルやコンパイルなどのツールも抽象化し、自動的に設定します。これにより、ツールの設定に時間をかけることなく、アプリケーションの構築に集中できます。

Next.js は個人の開発者であれ、大規模なチームの一員であれ、インタラクティブでダイナミック、かつ高速な Web アプリケーションの構築を支援します。

## 主な機能

Next.js（App Router）の主な機能には、次のようなものがあります。

| 機能                                                                            | 説明                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Routing](/docs/app-router/building-your-application/routing/)                  | Server Components の上に構築されたファイルシステムベースの Router で、レイアウト、ネストされたルーティング、エラー処理などをサポート                                                                            |
| [Rendering](/docs/app-router/building-your-application/rendering/)              | Client Components と Server Components によるクライアントサイドおよびサーバーサイドレンダリング。Next.js によるサーバー上の静的レンダリングと動的レンダリング。Edge および Node.js ランタイムでのストリーミング |
| [Data Fetching](/docs/app-router/building-your-application/data-fetching/)      | React Components の async/await サポートと、React と Web Platform に沿った`fetch()` API により、データ取得を簡素化                                                                                              |
| [Styling](/docs/app-router/building-your-application/styling/)                  | CSS モジュール、Tailwind CSS、CSS-in-JS など、お好みのスタイリング方法をサポート                                                                                                                                |
| [Optimizations](/docs/app-router/building-your-application/optimizing/)         | 画像、フォント、スクリプトの最適化により、アプリケーションのコアウェブ機能とユーザーエクスペリエンスを向上                                                                                                      |
| [Typescript](/docs/app-router/building-your-application/configuring/typescript) | TypeScript のサポートが改善され、より良い型チェックとより効率的なコンパイルが可能になったほか、カスタム TypeScript プラグインと型チェッカーも追加                                                               |

## このドキュメントの使い方

画面の左側には、ドキュメント・ナビゲーション・バーがあります。ドキュメントのページは、基本的なものから応用的なものまで、順を追って構成されています。しかし、どの順番でも読んでも構いませんし、あなたのユースケースに当てはまるページにスキップすることもできます。

最初に[インストール](./01-installation.md)をご覧ください。

## App Router vs Pages Router

Next.js には、App Router と Pages Router の 2 種類の Router があります。App Router は、Server Components やストリーミングなど、React の最新機能を利用できる新しい Router です。Pages Router は、サーバーレンダリングされた React アプリケーションをビルドできる Next.js オリジナルのルーターで、古い Next.js アプリケーションも引き続きサポートされています。

## 前提知識

Next.js のドキュメントは初心者にやさしいように設計されていますが、Next.js の機能に集中できるように、ベースラインを確立する必要があります。新しいコンセプトを紹介するときはいつでも、関連ドキュメントへのリンクを提供するようにします。

ドキュメントを最大限に活用するには、HTML、CSS、React の基本的な理解があることが推奨されます。React のスキルを磨く必要がある場合は、[Next.js 基礎コース](https://nextjs.org/learn/foundations/about-nextjs)をご覧ください。

## アクセシビリティ

ドキュメントを読みながらスクリーンリーダーを使用する際に最適なアクセシビリティを得るには、Firefox と NVDA、または Safari と VoiceOver の使用をお勧めします。

## コミュニティに参加する

Next.js に関する質問は、[GitHub Discussions](https://github.com/vercel/next.js/discussions)、[Discord](https://discord.com/invite/bUG2bvbtHy)、[Twitter](https://twitter.com/nextjs)、[Reddit](https://www.reddit.com/r/nextjs)のコミュニティでいつでも受け付けています。
