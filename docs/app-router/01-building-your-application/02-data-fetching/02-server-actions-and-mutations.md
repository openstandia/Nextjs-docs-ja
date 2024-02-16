---
title: Server Actionsとミューテーション
description: Learn how to handle form submissions and data mutations with Next.js.
related:
  description: Learn how to configure Server Actions in Next.js
  links:
    - app-router/api-reference/next-config-js/serverActions
---

Server Actionsはサーバー上で実行される**非同期関数**です。これは、Next.jsアプリケーションでフォームの送信とデータの変更を処理するために、サーバー及びクライアントコンポーネントで使用することができます。

> **🎥 Watch:** App Router でフォームとミューテーションについて詳しく学ぶ → [YouTube (10 分)](https://youtu.be/dDpZfOQBMaU?si=cJZHlUu_jFhCzHUg).

## 規約

Server ActionはReactの`["use server"](https://react.dev/reference/react/use-server)`ディレクティブを使用して定義できます。*非同期*関数の先頭にディレクティブを配置して、その関数をServer Actionとしてマークするか、または別のファイルの先頭に配置して、そのファイルのすべてのエクスポートをServer Actionしてマークすることができます。

### サーバーコンポーネント

サーバーコンポーネントでは、インライン関数レベルもしくはモジュールレベルで`"use server"`ディレクティブを使用できます。Server Actionをインラインにするには、関数本体の先頭に`"use server"`ディレクティブを追加します:

```tsx title="app/page.tsx"
// Server Component
export default function Page() {
  // Server Action
  async function create() {
    'use server'

    // ...
  }

  return (
    // ...
  )
}
```

### クライアントコンポーネント

クライアントコンポーネントでは、モジュールレベルで`"use server"`ディレクティブを使用しているアクションのみをインポートできます。

クライアントコンポーネントでServer Actionを呼び出すには、新しいファイルを作成し、そのファイルの先頭に`"use server"`ディレクティブを追加します。ファイル内の全ての関数は、クライアントコンポーネントとサーバーコンポーネントの両方で再利用できるServer Actionとしてマークされます:

```ts title="app/actions.ts"
'use server'

export async function create() {
  // ...
}
```

```tsx title="app/ui/button.tsx"
import { create } from '@/app/actions'

export function Button() {
  return (
    // ...
  )
}
```

また、Server Actionをpropとしてクライアントコンポーネントに渡すこともできます:

```tsx
<ClientComponent updateItem={updateItem} />
```

```tsx title="app/client-component.jsx"
'use client'

export default function ClientComponent({ updateItem }) {
  return <form action={updateItem}>{/* ... */}</form>
}
```

## Behavior

- Server Actionsは[`<form>`要素](/docs/app-router/ocs/app/building-your-application/data-fetching/server-actions-and-mutations#フォーム)の`action`属性を使用して呼び出すことができます。

  - サーバーコンポーネントはデフォルトでプログレッシブエンハンスメントをサポートしており、JavaScriptがまだロードされていないか無効になっていてもフォームは送信されます。
  - クライアントコンポーネントでは、JavaScriptがまだロードされていない場合、Server Actionsを呼び出すフォームは送信がキューイングされ、クライアントのハイドレーションが優先されます。
  - ハイドレーション後、ブラウザはフォームの送信時にリフレッシュされません。

- Server Actionsは`<form>`に限定されず、イベントハンドラ、`useEffect`、サードパーティのライブラリ、および`<button>`などの他のフォーム要素から呼び出すことができます。

- Server Actionsは、Next.jsの[キャッシュおよび再検証](/docs/app-router/building-your-application/caching)アーキテクチャと統合されています。アクションが呼び出されると、Next.jsは単一のサーバーラウンドトリップで更新されたUIと新しいデータの両方を返すことができます。

- 舞台裏では、アクションは`POST`メソッドを使用しており、`POST`メソッドのみがServer Actionsを呼び出すことができます。

- Server Actionsの引数および戻り値は、Reactによってシリアライズ可能である必要があります。[シリアライズ可能な引数および値](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values)のリストについては、Reactのドキュメントを参照してください。

- Server Actionsは関数です。これは、それらをアプリケーション内のどこでも再利用できることを意味します。

- Server Actionsは、使用されているページまたはレイアウトから[ランタイム](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes)を継承します。

- Server Actionsは、使用されているページまたはレイアウトからの[Route Segment Config](/docs/app-router/api-reference/file-conventions/route-segment-config)を継承します。これには`maxDuration`などのフィールドも含まれます。

## 例

### フォーム

ReactはHTMLの[`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form)要素を拡張し、`action`propを使用してServer Actionsを呼び出すことを可能にします。

フォーム内で呼び出されると、アクションは自動的に[`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData)オブジェクトを受け取ります。フィールドを管理するためにReactの`useState`を使用する必要はありません。代わりに、ネイティブの[`FormData`メソッド](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods)を使用してデータを抽出できます:

```tsx title="app/invoices/page.tsx"
export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate cache
  }

  return <form action={createInvoice}>...</form>
}
```

> **Good to know**:
>
> - 例:[Form with Loading & Error States](https://github.com/vercel/next.js/tree/canary/examples/next-forms)
> - 多くのフィールドを持つフォームを操作する場合は、JavaScriptの[`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries)メソッドと[`entries()`](https://developer.mozilla.org/en-US/docs/Web/API/FormData/entries)メソッドの使用を検討すると良いでしょう。例えば、次のようになります: `const rawFormData = Object.fromEntries(formData.entries())`
> - 詳細については、[Reactの`<form>`のドキュメント](https://react.dev/reference/react-dom/components/form#handle-form-submission-with-a-server-action)を参照してください。

#### 追加の引数の渡し方

JavaScriptの`bind`メソッドを使用して、Server Actionに追加の引数を渡すことができます。

```tsx title="app/client-component.tsx"
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User Name</button>
    </form>
  )
}
```

Server Actionは、フォームデータに加えて引数`userId`を受け取ります:

```js title="app/actions.js"
'use server'

export async function updateUser(userId, formData) {
  // ...
}
```

> **Good to know**:
>
> - 別の方法として、フォーム内の隠し入力フィールドとして引数を渡すことがあります（例: `<input type="hidden" name="userId" value={userId} />`）。ただし、この値は生成されたHTMLの一部となり、エンコードされません。
> - `.bind`はサーバーコンポーネントとクライアントコンポーネントの両方で機能します。また、プログレッシブエンハンスメントもサポートしています。

#### 保留中の状態

フォームが送信されている間に保留中の状態を表示するために、Reactの[`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)フックを使用することができます。

- `useFormStatus`は特定の`<form>`に対するステータスを返すため、**`<form>`要素の子として定義する必要があります**。
- `useFormStatus`はReactフックであるため、クライアントコンポーネント内で使用する必要があります。

```tsx title="app/submit-button.tsx"
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  )
}
```

`<SubmitButton />`は、任意のフォーム内にネストできます:

```tsx title="app/page.tsx"
import { SubmitButton } from '@/app/submit-button'
import { createItem } from '@/app/actions'

// Server Component
export default async function Home() {
  return (
    <form action={createItem}>
      <input type="text" name="field-name" />
      <SubmitButton />
    </form>
  )
}
```

#### サーバーサイドのバリデーションとエラーハンドリング

基本的なクライアントサイドのフォームバリデーションには、`required`や`type="email"`などのHTMLバリデーションを使用することをお勧めします。

より高度なサーバーサイドのバリデーションには、データを変更する前にフォームフィールドを検証するために[zod](https://zod.dev/)のようなライブラリを使用することができます:

```ts title="app/actions.ts"
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Mutate data
}
```

サーバーでフィールドが検証されたら、アクション内でシリアライズ可能なオブジェクトを返し、Reactの[`useFormState`](https://react.dev/reference/react-dom/hooks/useFormState)フックを使用してユーザーにメッセージを表示できます。

- `useFormState`にアクションを渡すことで、アクションの関数シグネチャが変更され、最初の引数として新しい`prevState`または`initialState`パラメータを受け取ります。
- `useFormState`はReactのフックであるため、クライアントコンポーネント内で使用する必要があります。

```ts title="app/actions.ts"
'use server'

export async function createUser(prevState: any, formData: FormData) {
  // ...
  return {
    message: 'Please enter a valid email',
  }
}
```

その後、`useFormState`フックにアクションを渡し、返された`state`を使用してエラーメッセージを表示できます。

```tsx title="app/ui/signup.tsx"
'use client'

import { useFormState } from 'react-dom'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction] = useFormState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      {/* ... */}
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
      <button>Sign up</button>
    </form>
  )
}
```

> **Good to know**:
>
> - データを変更する前に、常にユーザーがそのアクションを実行することが認可されているかどうかを確認する必要があります。[認証と認可](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations#認証と認可)を参照してください。

#### 楽観的な更新

サーバーアクションの完了を待つのではなく、UIを楽観的に更新するために、Reactの[`useOptimistic`](https://react.dev/reference/react/useOptimistic)フックを使用することができます:

```tsx title="app/page.tsx"
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

type Message = {
  message: string
}

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[]>(
    messages,
    (state: Message[], newMessage: string) => [
      ...state,
      { message: newMessage },
    ]
  )

  return (
    <div>
      {optimisticMessages.map((m, k) => (
        <div key={k}>{m.message}</div>
      ))}
      <form
        action={async (formData: FormData) => {
          const message = formData.get('message')
          addOptimisticMessage(message)
          await send(message)
        }}
      >
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

#### ネストした要素

`<form>`内のネストされた要素（例：`<button>`、`<input type="submit">`、および`<input type="image">`）でServer Actionを呼び出すことができます。これらの要素は`formAction` propまたは[イベントハンドラ](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations#イベントハンドラ)を受け入れます。

これは、フォーム内で複数のServer Actionsを呼び出したい場合に便利です。たとえば、投稿の下書きを保存するための`<button>`要素を作成し、それに加えて公開するための`<button>`要素を作成できます。詳細については、[Reactの`<form>`ドキュメント](https://react.dev/reference/react-dom/components/form#handling-multiple-submission-types)を参照してください。

#### プログラムによるフォームの送信

[`requestSubmit()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit)メソッドを使用してフォームの送信をトリガーできます。例えば、ユーザーが`⌘` + `Enter`を押したときに、`onKeyDown`イベントを受信できます:

```tsx title="app/entry.tsx"
'use client'

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  )
}
```

これにより、最も近い`<form>`の祖先の送信がトリガーされ、それによりServer Actionが呼び出されます。

### フォーム以外の要素

`<form>`要素内でServer Actionsを使用することが一般的ですが、イベントハンドラや`useEffect`など、コードの他の部分からも呼び出すことができます。

#### イベントハンドラ

`onClick`などのイベントハンドラからServer Actionを呼び出すことができます。例えば、likeのカウントを増やす場合:

```tsx title="app/like-button.tsx"
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

ユーザーエクスペリエンスを向上させるために、Server Actionがサーバー上で実行を終える前にUIを更新したり、保留中の状態を表示するために、[`useOptimistic`](https://react.dev/reference/react/useOptimistic)や[`useTransition`](https://react.dev/reference/react/useTransition)などの他のReactのAPIを使用することをお勧めします。

フォーム要素には、例えばフォームフィールドの変更時に保存するための`onChange`など、イベントハンドラを追加することもできます:

```tsx title="app/ui/edit-post.tsx"
'use client'

import { publishPost, saveDraft } from './actions'

export default function EditPost() {
  return (
    <form action={publishPost}>
      <textarea
        name="content"
        onChange={async (e) => {
          await saveDraft(e.target.value)
        }}
      />
      <button type="submit">Publish</button>
    </form>
  )
}
```

このような場合、複数のイベントが素早く連続して発生する可能性があるため、不要なServer Actionの呼び出しを防ぐために**デバウンシング**をお勧めします。

#### **useEffect**

Reactの[`useEffect`](https://react.dev/reference/react/useEffect)フックを使用して、コンポーネントがマウントされたときや依存関係が変更されたときにServer Actionを呼び出すことができます。これは、グローバルなイベントに依存する変更や自動的にトリガーする必要がある変更に役立ちます。例えば、アプリケーションのショートカットのための`onKeyDown`、無限スクロールのためのIntersection Observerフック、またはコンポーネントがマウントされたときにビューカウントを更新する場合などが挙げられます:

```tsx title="app/view-count.tsx"
'use client'

import { incrementViews } from './actions'
import { useState, useEffect } from 'react'

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)

  useEffect(() => {
    const updateViews = async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    }

    updateViews()
  }, [])

  return <p>Total Views: {views}</p>
}
```

`useEffect`の[動作と注意事項](https://react.dev/reference/react/useEffect#caveats)を考慮することを忘れないでください。

### エラーハンドリング

エラーが発生すると、クライアント上で最も近い[`error.js`](/docs/app-router/building-your-application/routing/error-handling)またはクライアントの`<Suspense>`バウンダリによってキャッチされます。UIで処理できるようにエラーを返すため、`try/catch`を使用することをお勧めします。

例えば、Server Actionは新しいアイテムを作成する際のエラーをメッセージで返すように処理するかもしれません:

```ts title="app/actions.ts"
'use server'

export async function createTodo(prevState: any, formData: FormData) {
  try {
    // Mutate data
  } catch (e) {
    throw new Error('Failed to create task')
  }
}
```

> **Good to know**:
>
> - エラーを投げるだけでなく、`useFormState`で処理するためにオブジェクトを返すこともできます。[サーバーサイドのバリデーションとエラーハンドリング](/docs/app-router/building-your-application/data-fetching/server-actions-and-mutations#サーバーサイドのバリデーションとエラーハンドリング)を参照してください。

### データの再検証

Server Actions内で[`revalidatePath`](/docs/app-router/api-reference/functions/revalidatePath)APIを使用して、[Next.jsのキャッシュ](/docs/app-router/building-your-application/caching)を再検証することができます:

```ts title="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidatePath('/posts')
}
```

または[`revalidateTag`](/docs/app-router/api-reference/functions/revalidateTag)を使用してキャッシュタグを指定し、特定のデータフェッチを無効にすることができます。

```ts title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts')
}
```

### リダイレクト

Server Actionの完了後にユーザーを別のルートにリダイレクトしたい場合、[`redirect`](/docs/app-router/api-reference/functions/redirect)APIを使用できます。`redirect`は`try/catch`ブロックの外で呼び出す必要があります:

```ts title="app/actions.ts"
'use server'

import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function createPost(id: string) {
  try {
    // ...
  } catch (error) {
    // ...
  }

  revalidateTag('posts') // Update cached posts
  redirect(`/post/${id}`) // Navigate to the new post page
}
```

### クッキー

Server Action内で[`cookies`](/docs/app-router/api-reference/functions/cookies)APIを使用して、クッキーを`get`（取得）、`set`（設定）、`delete`（削除）することができます。

```ts title="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  // Get cookie
  const value = cookies().get('name')?.value

  // Set cookie
  cookies().set('name', 'Delba')

  // Delete cookie
  cookies().delete('name')
}
```

Server Actions内でクッキーを削除する追加の例については、[関連する例](/docs/app-router/api-reference/functions/cookies#cookie-を削除する)をご覧ください。

## セキュリティ

### 認証と認可

Server Actionsは、公開APIエンドポイントと同様に扱い、アクションを実行するためにユーザーが認可されていることを確認する必要があります。例:

```ts title="app/actions.ts"
'use server'

import { auth } from './lib'

export function addItem() {
  const { user } = auth()
  if (!user) {
    throw new Error('You must be signed in to perform this action')
  }

  // ...
}
```

### クロージャと暗号化

コンポーネント内でServer Actionを定義すると、アクションが外部関数のスコープにアクセスできる[`クロージャ`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)が作成されます。例えば、`publish`アクションは変数`publishVersion`にアクセスできます:

```tsx title="app/page.tsx"
export default function Page() {
  const publishVersion = await getLatestVersion();

  async function publish(formData: FormData) {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('The version has changed since pressing publish');
    }
    ...
  }

  return <button action={publish}>Publish</button>;
}
```

アクションが呼び出されるとき、後で使用できるようにデータ（例:`publishVersion`）の*スナップショット*を取得する必要がある場合に、クロージャは役立ちます。

ただし、これを実現するには、キャプチャされた変数がアクションが呼び出されるときにクライアントに送信され、その後サーバーに戻る必要があります。機密データがクライアントに公開されるのを防ぐために、Next.jsはクローズドオーバーされた変数を自動的に暗号化します。Next.jsアプリケーションがビルドされるたびに、各アクションごとに新しいプライベートキーが生成されます。これにより、アクションは特定のビルドに対してのみ呼び出すことができます。

> **Good to know**: 機密の値がクライアントで公開されるのを防ぐために、暗号化だけに依存することはお勧めしません。その代わりに、[Reactのtaint API](https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#preventing-sensitive-data-from-being-exposed-to-the-client)を使用して、特定のデータがクライアントに送信されないよう積極的に防止するべきです。

### 暗号化キーの上書き（高度な設定）

複数のサーバーに横断して自分のNext.jsアプリケーションをホスティングする場合、各サーバーインスタンスは異なる暗号化キーを持つ可能性があり、潜在的な不整合が生じる可能性があります。

これを緩和するために、環境変数`process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`を使用して暗号化キーを上書きすることができます。この変数を指定することで、暗号化キーがビルドを超えて一貫して使用され、すべてのサーバーインスタンスが同じキーを使用します。

これは、アプリケーションにとって複数のデプロイで一貫した暗号化動作が重要な高度なユースケースです。キーローテーションや署名などの標準のセキュリティプラクティスを検討する必要があります。

> **Good to know**: VercelにデプロイされたNext.jsアプリケーションは、これを自動的に処理します。

### 許可されたオリジン（高度な設定）

Server Actionsは`<form>`要素で呼び出すことができるため、これにより[CSRF攻撃](https://developer.mozilla.org/en-US/docs/Glossary/CSRF)の対象になります。

Server Actionsは裏では`POST`メソッドを使用し、`POST`メソッドのみがServer Actionsを呼び出すことが許可されています。これにより、現代のブラウザではほとんどのCSRF脆弱性が防止されます。特に[SameSiteクッキー](https://web.dev/articles/samesite-cookies-explained)がデフォルトの状態であることが重要です。

追加の保護として、Next.jsのServer Actionsは[Originヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin)と[Hostヘッダー](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host)（または`X-Forwarded-Host`）を比較します。これらが一致しない場合、リクエストは中止されます。言い換えれば、Server Actionsはそれをホストするページと同じホストでのみ呼び出すことができます。

リバースプロキシやマルチレイヤーのバックエンドアーキテクチャ（サーバーAPIがプロダクションドメインと異なる場合）を使用する大規模なアプリケーションの場合、[`serverActions.allowedOrigins`](/docs/app-router/api-reference/next-config-js/server-actions)オプションを使用して安全なオリジンのリストを指定することがお勧めです。このオプションは文字列の配列を受け入れます。

```js title="next.config.js"
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

[セキュリティとServer Actions](https://nextjs.org/blog/security-nextjs-server-components-actions)について詳しく学ぶ。

Server Actionsに関する詳細な情報は、次のReactドキュメントを参照してください:

- [`"use server"`](https://react.dev/reference/react/use-server)
- [`<form>`](https://react.dev/reference/react-dom/components/form)
- [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)
- [`useFormState`](https://react.dev/reference/react-dom/hooks/useFormState)
- [`useOptimistic`](https://react.dev/reference/react/useOptimistic)
