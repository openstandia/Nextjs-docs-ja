---
title: default.js
description: default.js ファイルのAPIリファレンス
related:
  title: Parallel Routesの詳細を学ぶ
  links:
    - app-router/building-your-application/routing/parallel-routes
sidebar_position: 1
---

`default.js` ファイルは、Next.jsが全ページロード後、[スロット](/docs/app-router/building-your-application/routing/parallel-routes#slots)のアクティブな状態を復元できない場合、[Parallel Routes](/docs/app-router/building-your-application/routing/parallel-routes)内でフォールバックをレンダリングするために使用されます。

[ソフトナビゲーション](/docs/app-router/building-your-application/routing/linking-and-navigating#5-ソフトナビゲーション)中に、Next.jsは各スロットのアクティブな*state*（サブページ）を追跡します。しかし、ハードナビゲーション（全ページロード）では、Next.jsはアクティブな状態を復元できません。この場合、現在のURLとマッチしないサブページに対して`default.js`ファイルがレンダリングされます。

以下のフォルダー構造を考えてみましょう。 `@team` スロットは `settings` ページを持っていますが、`@analytics` は持っていません。

![Parallel Routesのマッチしないルート](../../assets/parallel-routes-unmatched-routes.avif)

`/dashboard/settings` に移動すると、 `@team` スロットは `settings` ページをレンダリングし、 `@analytics` スロットの現在アクティブなページを保持します。

リフレッシュすると、Next.jsは `@analytics` の `default.js` をレンダリングします。 `default.js` が存在しない場合は、代わりに `404` がレンダリングされます。

<!-- textlint-disable -->

さらに `children` は暗黙のスロットであるため、親ページのアクティブな状態をNext.jsが復元できない場合、`children` のフォールバックをレンダリングするために `default.js` ファイルを作成する必要があります。

<!-- textlint-enable -->

## Props

### `params`（任意）

Route Segmentからスロットのサブページまでの [動的ルートパラメータ](/docs/app-router/building-your-application/routing/dynamic-routes) を含むオブジェクトです。例:

| 例                                         | URL          | `params`                            |
| ------------------------------------------ | ------------ | ----------------------------------- |
| `app/@sidebar/[artist]/default.js`         | `/zack`      | `{ artist: 'zack' }`                |
| `app/@sidebar/[artist]/[album]/default.js` | `/zack/next` | `{ artist: 'zack', album: 'next' }` |

## Parallel Routesの詳細を学ぶ

[Parallel Routes](/docs/app-router/building-your-application/routing/parallel-routes)
