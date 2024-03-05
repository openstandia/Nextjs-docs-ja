---
title: Metadata Files API Reference
nav_title: Metadata Files
description: メタデータファイルの規約に関するAPIドキュメンテーション。
---

このセクションでは、**メタデータファイルの規約**について説明します。ファイルベースのメタデータは、特殊なメタデータファイルをルート Segment に追加することで定義できます。

各ファイル規約は、静的ファイル（例：`opengraph-image.jpg`）を作成、または動的に生成（例：`opengraph-image.js`）することで定義できます。

<!-- textlint-disable -->

ファイルが定義されると、Next.js は自動的にそのファイルを配信し（本番環境ではキャッシングのためにハッシュが含まれる）、アセットの URL、ファイルタイプ、画像サイズなど、正しいメタデータで関連するヘッド要素を更新します。

### favicon, icon, apple-icon

[Favicon、Icon、Apple Icon ファイル規約のための API リファレンス](/docs/app-router/api-reference/file-conventions/metadata/app-icons)

### manifest.json

[manifest.json ファイルのための API リファレンス](/docs/app-router/api-reference/file-conventions/metadata/manifest)

### opengraph-image と twitter-image

[OpenGraph 画像と Twitter 画像ファイル規約のための API リファレンス](/docs/app-router/api-reference/file-conventions/metadata/opengraph-image)

### robots.txt

[robots.txt ファイル規約のための API リファレンス](/docs/app-router/api-reference/file-conventions/metadata/robots)

### sitmap.xml

[sitemap.xml ファイル規約のための API リファレンス](/docs/app-router/api-reference/file-conventions/metadata/sitemap)
