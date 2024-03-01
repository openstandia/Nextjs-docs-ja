---
title: Parallel Routes
description: 独立してナビゲートできる 1 つまたは複数のページを、同じビューで同時にレンダリングします。非常に動的なアプリケーション向けのパターンです。
---

Parallel Routes を使用すると、1 つまたは複数のページを同じレイアウトで同時に、または条件付きでレンダリングできます。ダッシュボードやソーシャルサイトのフィードなど、アプリケーション内の非常に動的なセクションのに対して、パラレルなルーティングを使用して複雑なルーティングパターンを実装できます。

例えば、ダッシュボードを例にとると、Parallel Route を使って `team` ページと `analytics` ページを同時にレンダリングできます:

![Parallel Routes](../../assets/parallel-routes.avif)

## スロット

Parallel Routes は名前付き**スロット**を使って作成されます。スロットは `@folder` の規約で定義されます。例えば、次のようなファイル構造は `@analytics` と `@team` ファイル構造は 2 つの明示的なスロットを定義しています:

![Parallel Routes File-system Structure](../../assets/parallel-routes-file-system.avif)

スロットは共通の親レイアウトに Props として渡されます。上の例では、`app/layout.js` のコンポーネントは `@analytics` と `@team` のスロットの Props を受け入れ、`children` の Prop と並行してレンダリングできます:

```tsx title="app/layout.tsx"
export default function Layout({
  children,
  team,
  analytics,
}: {
  children: React.ReactNode
  analytics: React.ReactNode
  team: React.ReactNode
}) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  )
}
```

<!-- textlint-disable -->
しかし、スロットは[ルート Segment](/docs/app-router/building-your-application/routing/#ルート-segment) ではないので、URL 構造には影響しません。例えば、`/dashboard/@analytics/views` の場合、`@analytics` はスロットなので、URL は `/dashboard/views` になります。
<!-- textlint-enable -->

> **Good to know:** `children` は暗黙のスロットで、フォルダにマッピングする必要はありません。つまり、`app/page.js` は `app/@children/page.js` と等価です。

## アクティブ状態とナビゲーション

デフォルトで、Next.js は各スロットのアクティブな _状態_（またはサブページ）を追跡します。ただし、スロット内にレンダリングされる内容は、ナビゲーションの種類によって異なります:

<!-- textlint-disable -->
- [**ソフトナビゲーション**](/docs/app-router/building-your-application/routing/linking-and-navigating#5-ソフトナビゲーション): クライアントサイドでのナビゲーション中、Next.js は[部分レンダリング](/docs/app-router/building-your-application/routing/linking-and-navigating#4-部分レンダリング)を実行し、スロット内のサブページを変更しながら、現在のURLと一致しない他のスロットのアクティブなサブページも維持します。
<!-- textlint-enable -->
- **ハードナビゲーション**: 全ページの読み込み（ブラウザの更新）後、Next.js は現在の URL と一致しないスロットのアクティブ状態を特定できません。代わりに、一致しないスロットに対して [`default.js`](#defaultjs) ファイルをレンダリングします。`default.js`が存在しない場合は、`404` をレンダリングします。

> **Good to know**:
>
> - 一致しないルートに対する `404` は、意図されていないページで並行ルートを誤ってレンダリングすることを防ぐのに役立ちます。

### `default.js`

初期ロードまたはフルページリロード時に一致しないスロットがあった場合のフォールバックとしてレンダリングする `default.js` ファイルを定義できます。

次のフォルダ構造を考えてみましょう。`@team` スロットには `/settings` ページがありますが、`@analytics` にはありません。

![並行ルートの一致しないルート](../../assets/parallel-routes-unmatched-routes.avif)

`/dashboard/settings` に遷移すると、`@team` スロットは `/settings` ページをレンダリングし、`@analytics` スロットの現在アクティブなページを維持します。

リフレッシュ時、Next.jsは `@analytics` のために `default.js` をレンダリングします。もし `default.js` が存在しなければ、代わりに `404` がレンダリングされます。

<!-- textlint-disable -->
さらに `children` は暗黙のスロットであるため、Next.js が親ページのアクティブな状態を復旧できない場合に `children` のフォールバックをレンダリングするための `default.js` ファイルも作成する必要があります。
<!-- textlint-enable -->

### `useSelectedLayoutSegment(s)`

[`useSelectedLayoutSegment`](/docs/app-router/api-reference/functions/use-selected-layout-segment) と [`useSelectedLayoutSegments`](/docs/app-router/api-reference/functions/use-selected-layout-segments) は、`parallelRoutesKey` パラメータを受け入れます。これにより、スロット内のアクティブなルート Segment を読み取ることができます。

```tsx title="app/layout.tsx"
'use client'

import { useSelectedLayoutSegment } from 'next/navigation'

export default function Layout({ auth }: { auth: React.ReactNode }) {
  const loginSegments = useSelectedLayoutSegment('auth')
  // ...
}
```

<!-- textlint-disable -->
ユーザーが `app/@auth/login`（または URL バーから `/login`）にアクセスすると、`loginSegments` は文字列 `"login"` と等しくなります。
<!-- textlint-enable -->

## 例

### 条件付きルート

特定の条件に基づいてルートを条件付きでレンダリングするために、Parallel Routes を使用できます。例えば、`/admin` や `/user` のロールに応じて異なるダッシュボードページをレンダリングするには:

![条件付きルートの図](../../assets/conditional-routes-ui.avif)

```tsx title="app/dashboard/layout.tsx"
import { checkUserRole } from '@/lib/auth'

export default function Layout({
  user,
  admin,
}: {
  user: React.ReactNode
  admin: React.ReactNode
}) {
  const role = checkUserRole()
  return <>{role === 'admin' ? admin : user}</>
}
```

### タブグループ

スロットの中に `layout` を追加して、ユーザーがそのスロットを独立してナビゲートできるように設定できます。これは、タブを作成する際に便利です。

例えば、`@analytics` スロットには `/page-views` と `/visitors` の2つのサブページがあります。

![Analytics スロットには2つのサブページとレイアウトがあります](../../assets/parallel-routes-tab-groups.avif)

`@analytics` の中で、2つのページ間でタブを共有するために、[`layout`](/docs/app-router/building-your-application/routing/pages-and-layouts) ファイルを作成します:

```tsx title="app/dashboard/@analytics/layout.tsx"
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Link href="/dashboard/page-views">Page Views</Link>
        <Link href="/dashboard/visitors">Visitors</Link>
      </nav>
      <div>{children}</div>
    </>
  )
}
```

### モーダル

[Intercepting Routes](/docs/app-router/building-your-application/routing/intercepting-routes)と組み合わせることで、Parallel Routesを使用してモーダルを作成できます。これにより、モーダルをビルドする際によく遭遇する課題を解決できます。例えば:

- モーダルの内容を **URLを通じて共有**できるようにします。
- ページをリフレッシュした際にモーダルが閉じるのではなく、**コンテキストを保持**します。
- 前のルートに戻るのではなく、**後方ナビゲーションでモーダルを閉じ**ます。
- **前方ナビゲーションでモーダルを再開**します。

以下のUIパターンでは、ユーザーがクライアントサイドナビゲーションを使用してレイアウトからログインモーダルを開くか、別の `/login` ページにアクセスできます:

![パラレルルートダイアグラムを認証モーダルと並べたイメージ](../../assets/parallel-routes-auth-modal.avif)

このパターンを実装するには、**メイン**ログインページをレンダリングする `/login` ルートを作成してください。

![パラレルルートダイアグラム](../../assets/parallel-routes-modal-login-page.avif)

```tsx title="app/login/page.tsx"
import { Login } from '@/app/ui/login'

export default function Page() {
  return <Login />
}
```

その後、`@auth` スロット内に [`default.js`](/docs/app-router/api-reference/file-conventions/default) ファイルを追加し、`null` を返します。これにより、モーダルがアクティブでない場合、レンダリングされないようにします。

```tsx title="app/@auth/default.tsx"
export default function Default() {
  return null
}
```

`@auth` スロット内で `/login` ルートをインターセプトするために、`/(.)login` フォルダを更新します。`<(.)login/page.tsx` ファイルに `<Modal>` コンポーネントとその子をインポートします:

```tsx title="app/@auth/(.)login/page.tsx"
import { Modal } from '@/app/ui/modal'
import { Login } from '@/app/ui/login'

export default function Page() {
  return (
    <Modal>
      <Login />
    </Modal>
  )
}
```

**Good to know:**

- ルートをインターセプトするために使用される規則（例: `(.)`）は、ファイルシステムの構造に依存します。詳しくは [ルートのインターセプト規約](/docs/app-router/building-your-application/routing/intercepting-routes#規約) を参照してください
- `<Modal>` 機能をモーダルの内容（`<Login>`）から分離することで、モーダル内のすべてのコンテンツ（例: [フォーム](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations#フォーム)）がServer Componentであることを保証できます。詳細については [Client Components と Server Component を混在させる](/docs/app-router/building-your-application/rendering/composition-patterns#server-components-と-client-components-を混在させる) を参照してください

#### モーダルを開く

<!-- textlint-disable -->
これで、Next.jsの Router を利用してモーダルを開閉できるようになります。モーダルを開いたときと、前後にナビゲートしたとき、URL が正しく更新されます。
<!-- textlint-enable -->

モーダルを開くには、`@auth` スロットを親レイアウトに props として渡し、`children` props とともにレンダリングします。

```tsx title="app/layout.tsx"
import Link from 'next/link'

export default function Layout({
  auth,
  children,
}: {
  auth: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <nav>
        <Link href="/login">モーダルを開く</Link>
      </nav>
      <div>{auth}</div>
      <div>{children}</div>
    </>
  )
}
```

ユーザーが `<Link>` をクリックすると、`/login` ページへナビゲートされる代わりにモーダルが開きます。しかし、リフレッシュまたは初期読み込み時に `/login` へナビゲートされると、ユーザーはメインのログインページに移動します。

#### モーダルを閉じる

`router.back()` を呼び出すか、`Link` コンポーネントを使用してモーダルを閉じることができます。

```tsx title="app/ui/modal.tsx"
'use client'

import { useRouter } from 'next/navigation'

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => {
          router.back()
        }}
      >
        モーダルを閉じる
      </button>
      <div>{children}</div>
    </>
  )
}
```

`@auth` スロットを表示しなくて良いページから離れるときに `Link` コンポーネントを使用する場合、`null` を返すキャッチオールのルートを使用します。

```tsx title="app/ui/modal.tsx"
import Link from 'next/link'

export function Modal({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Link href="/">モーダルを閉じる</Link>
      <div>{children}</div>
    </>
  )
}
```

```tsx title="app/@auth/[...catchAll]/page.tsx"
export default function CatchAll() {
  return null
}
```

**Good to know:**

- [アクティブ状態とナビゲーション](#アクティブ状態とナビゲーション) で記述されているとおり、`@auth` スロットにキャッチオールルートを使用してモーダルを閉じます。スロットに一致しなくなったルートへのクライアント側のナビゲーションは表示されたままになるので、モーダルを閉じるには、`null` を返すルートにスロットを一致させる必要があります。
- 他の例としては、ギャラリー内で写真モーダルを開きつつ `/photo/[id]` ページを専用に持つ、またはサイドモーダルでショッピングカートを開く、などがあります。
- Intercept Routes と Parallel Routes を使ったモーダルの例は[こちら](https://github.com/vercel-labs/nextgram)で見ることができます。

### ローディングとエラー UI

Parallel Routes は独立してストリーミングできるため、各ルートに独立したエラーとローディングの状態を定義できます:

![並行するルートがカスタムエラーとローディングの状態を可能にする](../../assets/parallel-routes-cinematic-universe.avif)

詳細については、[ローディング UI](/docs/app-router/building-your-application/routing/loading-ui-and-streaming) と [Error Handling](/docs/app-router/building-your-application/routing/error-handling) のドキュメントを参照してください。