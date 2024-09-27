---
title: 静的アセット
description: Next.jsでは、公開ディレクトリ内の画像などの静的ファイルを提供することができます。こちらでその動作方法を学ぶことができます。
---

Next.js では、ルートディレクトリの`public`というフォルダの下に、画像などの静的ファイルを置くことができます。`public`内のファイルは、ベース URL（`/`）から始まるコードで参照できます。

たとえば、`public`の中に`me.png`を追加すると、次のコードで画像にアクセスできます：

```js title="Avatar.js"
import Image from 'next/image'

export function Avatar() {
  return <Image src="/me.png" alt="me" width="64" height="64" />
}
```

`robots.txt`、`favicon.ico`などの静的なメタデータファイルについては、`app`フォルダ内の[特別なメタデータファイル](/docs/app-router/api-reference/file-conventions/metadata)を使用する必要があります。

> **Good to know**:
>
> - ディレクトリ名は`public`でなければなりません。この名前は変更できず、静的アセットの提供に使用される唯一のディレクトリです。
> - Next.js が提供するのは、[ビルド時](/docs/app-router/api-reference/next-cli#build)に`public`ディレクトリにあるアセットだけです。リクエスト時に追加されたファイルは利用できません。永続的なファイルストレージには、[AWS S3](https://aws.amazon.com/s3/)などのサードパーティサービスを利用することをお勧めします。
