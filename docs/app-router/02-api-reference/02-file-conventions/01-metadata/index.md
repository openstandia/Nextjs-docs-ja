---
title: Metadata Files API Reference
sidebar_label: メタデータファイル
description: メタデータファイルの規約に関するAPIドキュメンテーションです。
---

このセクションでは、**メタデータファイルの規約**について説明します。ファイルベースのメタデータは、特殊なメタデータファイルをルート Segment に追加することで定義できます。

各ファイル規約は、静的ファイル（例：`opengraph-image.jpg`）を作成、または動的に生成（例：`opengraph-image.js`）することで定義できます。

<!-- textlint-disable -->

ファイルが定義されると、Next.js は自動的にそのファイルを配信し（本番環境ではキャッシングのためにハッシュが含まれる）、アセットの URL、ファイルタイプ、画像サイズなど、正しいメタデータで関連するヘッド要素を更新します。

- [favicon, icon, apple-icon](./app-icons.md): Favicon、icon、および Apple icon ファイルの規則に関するAPIリファレンスです。
- [manifest.json](./manifest.md): manifest.json ファイルの API リファレンスです。
- [opengraph-image と twitter-image](./opengraph-image.md): Open Graph 画像および Twitter 画像ファイルの規則に関する API リファレンスです。
- [robots.txt](./robots.md): robots.txt ファイルの API リファレンスです。
- [sitemap.xml](./sitemap.md): sitemap.xml ファイルの API リファレンスです。
