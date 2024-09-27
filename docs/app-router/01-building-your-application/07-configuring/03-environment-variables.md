---
title: 環境変数
description: Next.jsアプリケーションで環境変数を追加してアクセスする方法を学びます。
---

<details>
  <summary>例</summary>

- [Environment Variables](https://github.com/vercel/next.js/tree/canary/examples/environment-variables)

</details>

Next.js は環境変数をサポートしており、次のようなことができます:

- [`.env.local` を使って環境変数をロードする](#環境変数のロード)
- [`NEXT_PUBLIC_` をプレフィックスとしてブラウザ用の環境変数をバンドルする](#ブラウザ用環境変数のバンドル)

## 環境変数のロード

Next.jsには、環境変数を `.env.local` から `process.env` にロードするためのサポートが組み込まれています。

```txt title=".env.local"
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

> **注**: Next.jsは `.env*` ファイル内のマルチライン変数もサポートしています:
>
> ```bash
> # .env.local
>
> # 改行して書くことができます
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
> ...
> Kh9NV...
> ...
> -----END DSA PRIVATE KEY-----"
>
> # または二重引用符で囲んで `\n` をつけます。
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END DSA PRIVATE KEY-----\n"
> ```

> **注**: `/src` フォルダを使用している場合、Next.js は親フォルダから **のみ** .env ファイルを読み込み、`/src` フォルダからは読み込まないことに注意してください。
> これにより、`process.env.DB_HOST`、`process.env.DB_USER`、`process.env.DB_PASS` が自動的に Node.js 環境にロードされ、[Route Handlers](/docs/app-router/building-your-application/routing/route-handlers) で利用できるようになります。

例えば:

```js title="app/api/route.js"
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

### 他の変数の参照

Next.js は、`.env*` ファイル内の `$VARIABLE` など、`$` を使って他の変数を参照する変数を自動的に展開します。
これにより、他のシークレットを参照できるようになります。例えば:

```txt title=".env"
TWITTER_USER=nextjs
TWITTER_URL=https://twitter.com/$TWITTER_USER
```

上記の例では、`process.env.TWITTER_URL` は `https://twitter.com/nextjs` となります。

> **Good to know**: 実際の値に `$` が含まれる変数を使用する必要がある場合は、`$` をエスケープする必要があります。例えば、`\$` です。

## ブラウザ用環境変数のバンドル

`NEXT_PUBLIC_` 以外の環境変数は Node.js 環境でのみ利用可能で、ブラウザからはアクセスできません（クライアントは別の _環境_ で実行されます）。

ブラウザから環境変数の値にアクセスできるようにするために、Next.js はビルド時にクライアントに配信される js バンドルに値を "インライン" し、
`process.env.[variable]` への参照をすべてハードコードされた値に置き換えることができます。
これを行うには、変数の前に `NEXT_PUBLIC_` を付けるだけです。例えば:

```txt title="Terminal"
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

これにより、Node.js 環境の `process.env.NEXT_PUBLIC_ANALYTICS_ID` への参照をすべて、`next build` を実行した環境の値に置き換えるよう Next.js に指示します。これは、ブラウザに送信されるすべての JavaScript にインライン化されます。

> **注**: ビルド後、アプリはこれらの環境変数の変更に反応しなくなります。例えば、Herokuパイプラインを使用して、
> ある環境でビルドされたスラッグを別の環境にプロモートする場合や、単一のDockerイメージをビルドして複数の環境にデプロイする場合、
> すべての `NEXT_PUBLIC_` 変数はビルド時に評価された値で凍結されるため、プロジェクトのビルド時にこれらの値を適切に設定する必要があります。
> 実行環境の値にアクセスする必要がある場合は、独自のAPIをセットアップしてクライアントに提供する必要があります（オンデマンドまたは初期化中に）。

```js title="pages/index.js"
import setupAnalyticsService from '../lib/my-analytics-service'

// 'NEXT_PUBLIC_ANALYTICS_ID'は、先頭に'NEXT_PUBLIC_'が付くので、ここで使用することができます。
// これはビルド時に `setupAnalyticsService('abcdefghijk')` に変換されます。
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

動的検索はインライン化され **ない** ことに注意してください:

```js
// これはインライン化されません。
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])

// これはインライン化されません。
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

### ランタイム環境変数

Next.jsは、ビルド時と実行時の両方の環境変数をサポートできます。

**デフォルトでは、環境変数はサーバーでのみ利用可能です。** 環境変数をブラウザに公開するには、その前に `NEXT_PUBLIC_` を付けなければなりません。
しかし、これらの公開環境変数は `next build` 時に JavaScript バンドルにインライン化されます。

実行時の環境変数を読み取るには、`getServerSideProps` を使用するか、[App Routerを段階的に採用する](/docs/app-router/building-your-application/upgrading/app-router-migration)ことを推奨します。
App Routerを使えば、動的レンダリング中にサーバ上の環境変数を安全に読み取ることができます。
これにより、異なる値を持つ複数の環境を通して昇格させることができる単一のDockerイメージを使用することができます。

```jsx
import { unstable_noStore as noStore } from 'next/cache'

export default function Component() {
  noStore()
  // cookies()、headers()、およびその他の動的関数も動的レンダリングを選択するため、
  // このenv変数は実行時に評価されます。
  const value = process.env.MY_VALUE
  // ...
}
```

**Good to know:**

- [register 関数](/docs/app-router/building-your-application/optimizing/instrumentation)を使えば、サーバー起動時にコードを実行できます。
- スタンドアロン出力モードでは動作しないため、[runtimeConfig](https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration) オプションの使用は推奨しません。代わりに、App Routerを[段階的に採用する](/docs/app-router/building-your-application/upgrading/app-router-migration)ことを推奨します。

## デフォルトの環境変数

通常、必要なのは `.env.local` ファイル1つだけです。しかし、開発環境(`next dev`)や本番環境(`next start`)でいくつかのデフォルト値を追加したい場合もあるでしょう。

Next.jsでは、`.env`（すべての環境）、`.env.development`（開発環境）、`.env.production`（本番環境）にデフォルトを設定できます。

`.env.local` は常に設定されたデフォルトを上書きします。

> **Good to know**: `.env`、`.env.development`、`.env.production` ファイルはデフォルトを定義しているので、リポジトリに含めるべきです。
> **`.env*.local` は `.gitignore` に追加してください。** これらのファイルは無視されることを意図しています。`.env.local` はシークレットを保存する場所です。

## Vercelの環境変数

Next.jsアプリケーションを [Vercel](https://vercel.com) にデプロイする際、[プロジェクト設定](https://vercel.com/docs/projects/environment-variables?utm_medium=docs&utm_source=next-site&utm_campaign=next-website)で環境変数を設定することができます。

すべての種類の環境変数がそこで設定されなければなりません。
開発で使用される環境変数でさえも、後から[ローカルデバイスにダウンロードする](https://vercel.com/docs/concepts/projects/environment-variables#development-environment-variables?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)ことができます。

[開発環境変数](https://vercel.com/docs/concepts/projects/environment-variables#development-environment-variables?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)を設定した場合は、
以下のコマンドを使用して、ローカルマシンで使用するための `.env.local` に取り込むことができます:

```bash title="Terminal"
vercel env pull .env.local
```

> **Good to know**: Next.js アプリケーションを [Vercel](https://vercel.com) にデプロイするとき、`.env*` ファイルにある環境変数は、`NEXT_PUBLIC_` というプレフィックスが付かない限り、Edge Runtimeでは利用できません。環境変数は[プロジェクト設定](https://vercel.com/docs/projects/environment-variables?utm_medium=docs&utm_source=next-site&utm_campaign=next-website)で管理することを強くお勧めします。

## テスト環境変数

`development` と `production` とは別に、3番目のオプションとして `test` 環境があります。開発環境や本番環境にデフォルトを設定できるのと同じように、テスト環境用の `.env.test` ファイルでも同じことができます（ただし、これは前の2つほど一般的ではありません）。
Next.jsは、テスト環境で `.env.development` や `.env.production` から環境変数を読み込みません。

これは、`jest` や `cypress` のようなツールでテストを実行する際に、 テスト用に特定の環境変数のみを設定する必要がある場合に便利です。
`NODE_ENV` が `test` に設定されている場合は、テストのデフォルト値が読み込まれます。テストツールが対応してくれるので、通常は手動で設定する必要はありません。

テスト環境と開発環境、本番環境の間には、心に留めておかなければならないちょっとした違いがあります:<br />
`.env.local` は読み込まれません。テストは誰にとっても同じ結果をもたらすことを期待しているからです。
`.env.local`（はデフォルトの設定を上書きするためのものです）を無視することで、すべてのテスト実行で同じデフォルトの環境変数が使用されます。

> **Good to know**: デフォルトの環境変数と同様に、`.env*.local` は `.gitignore` によって無視されることを意図しているため `.env.test.local` はリポジトリに含めるべきではありません。

ユニットテストの実行中に、`@next/env` パッケージの `loadEnvConfig` 関数を活用することで、Next.jsと同じように環境変数をロードすることができます。

```js
// 以下は、Jest のグローバルセットアップファイルなどで使用できます。
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}
```

## 環境変数のロード順序

環境変数は以下の場所から順に検索され、変数が見つかった時点で停止します。

1. `process.env`
1. `.env.$(NODE_ENV).local`
1. `.env.local` (`NODE_ENV` が `test` の場合はチェックしません)
1. `.env.$(NODE_ENV)`
1. `.env`

例えば、`NODE_ENV` が `development` で、`.env.development.local` と `.env` の両方で変数を定義した場合、`.env.development.local` の値が使用されます。

> **Good to know**: `NODE_ENV` に指定できる値は、`production`、`development`、`test` です。

## Good to know

- [`/src` ディレクトリ](/docs/app-router/building-your-application/configuring/src-directory)を使用している場合、`.env.*` ファイルはプロジェクトのルートに残す必要があります。
- 環境変数 `NODE_ENV` が割り当てられていない場合、Next.js は `next dev` コマンドの実行時に自動的に `development` を割り当てます。それ以外のコマンドについては、`production` を割り当てます。

## バージョン履歴

| Version  | Changes                                     |
| -------- | ------------------------------------------- |
| `v9.4.0` | `.env` と `NEXT_PUBLIC_` が導入されました。 |
