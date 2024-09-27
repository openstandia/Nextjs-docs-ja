---
title: App Router
description: Layouts、Server Components、Suspenseなど、Next.js と React の最新機能を備えた新しい App Router をご利用ください。
---

:::caution
本ドキュメントは[公式ドキュメント](https://nextjs.org/docs)の [v14.1.0](https://github.com/vercel/next.js/tree/v14.1.0/docs) の断面を翻訳したものです。Next.js の公式 X アカウントにも[ポスト](https://twitter.com/nextjs/status/1746921179879735677)頂きました。

[公式ドキュメント](https://nextjs.org/docs)のアップデートに追随して適宜更新しますが、最新情報が反映できていない可能性があります。

一部翻訳途中のページがありますが、随時翻訳を追加予定です。
:::

Next.js の App Router は、React の最新機能を使ってアプリケーションを構築するための新しい方法です。すでに Next.js に慣れ親しんでいる方であれば、App Router が既存のファイルシステムベースのルーターである [Pages Router](https://nextjs.org/docs/pages) の自然な進化形であることがわかるでしょう。

新しいアプリケーションには、App Router の使用をお勧めします。既存のアプリケーションについては、[段階的に App Router に移行できます](/docs/app-router/building-your-application/upgrading/app-router-migration)。同じアプリケーションで両方のルーターを使用することも可能です。

このセクションでは、App Router で利用可能な機能について説明します。
