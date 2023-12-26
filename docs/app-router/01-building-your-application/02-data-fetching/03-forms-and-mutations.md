---
title: フォームとミューテーション
description: Learn how to handle form submissions and data mutations with Next.js.
---

フォームを使うと、Web アプリケーションでデータを作成したり更新したりできます。Next.js では、**Server Actions**を使用して、フォームの送信とデータの変更を処理する強力な方法を提供します。

<details>
  <summary>Examples</summary>

- [Form with Loading & Error States](https://github.com/vercel/next.js/tree/canary/examples/next-forms)

</details>

## Server Actions の仕組み

Server Actions では、API エンドポイントを手動で作成する必要はありません。代わりに、コンポーネントから直接呼び出せる非同期のサーバー関数を定義します。

> **🎥 Watch:** App Router でフォームとミューテーションについて詳しく学ぶ → [YouTube (10 分)](https://youtu.be/dDpZfOQBMaU?si=cJZHlUu_jFhCzHUg).

Server Actions は、Server Components で定義することも、Client Components から呼び出すこともできます。Server Components でアクションを定義すると、JavaScript なしでフォームを機能させることができ、プログレッシブエンハンスメントを実現できます。

> **Good to know**:
>
> - Server Components から Server Actions を呼び出すフォームは、JavaScript なしで機能します
> - Client Components から Server Actions を呼び出すフォームは、JavaScript がまだ読み込まれていない場合、送信をキューに入れます
> - Server Actions は、使用するページやレイアウトの[ランタイム](/docs/app-router/building-your-application/rendering/edge-and-nodejs-runtimes)を継承します
> - Server Actions は完全に静的なルートで動作します（ISR によるデータの再検証を含む）

## キャッシュデータの再検証

Server Actions は、Next.js の[キャッシュおよび再検証](/docs/app-router/building-your-application/caching)アーキテクチャに深く統合されています。フォームが送信されると、Server Actions はキャッシュされたデータを更新し、変更すべきキャッシュキーを再検証します。

従来のアプリケーションのようにルートごとに 1 つのフォームに制限されるのではなく、Server Actions はルートごとに複数のアクションを持つことができます。さらに、ブラウザはフォーム送信時にリフレッシュする必要がありません。1 回のネットワークラウンドトリップで、Next.js は更新された UI と更新されたデータの両方を返すことができます。

[Server Actions からデータを再検証する](#キャッシュデータの再検証)例を参照してください。

## 例

### Server-Only フォーム

Server-Only フォームを作成するには、Server Component で Server Action を定義します。このアクションは、関数の先頭に`"use server"`ディレクティブを記述してインラインで定義するか、あるいは、ファイルの先頭にディレクティブを記述して別のファイルで定義します。

```tsx title="app/page.tsx"
export default function Page() {
  async function create(formData: FormData) {
    'use server'

    // データの変更
    // キャッシュの再検証
  }

  return <form action={create}>...</form>
}
```

> **Good to know**: `<form action={create}>`は[FormData](https://developer.mozilla.org/docs/Web/API/FormData/FormData)データ型を取ります。上の例では、HTML[フォーム](https://developer.mozilla.org/docs/Web/HTML/Element/form)から送信された FormData はサーバアクション`create`でアクセス可能です。

### データの再検証

Server Actions では、[Next.js のキャッシュ](/docs/app-router/building-your-application/caching)をオンデマンドで無効にできます。[`revalidatePath`](/docs/app-router/api-reference/functions/revalidatePath)でルート Segment 全体を無効にできます：

```ts title="app/actions.ts"
'use server'

import { revalidatePath } from 'next/cache'

export default async function submit() {
  await submitForm()
  revalidatePath('/')
}
```

または[`revalidateTag`](/docs/app-router/api-reference/functions/revalidateTag)でキャッシュタグを指定して特定のデータフェッチを向こうにします：

```ts title="app/actions.ts"
'use server'

import { revalidateTag } from 'next/cache'

export default async function submit() {
  await addPost()
  revalidateTag('posts')
}
```

### リダイレクト

Server Action の完了後にユーザーを別のルートにリダイレクトしたい場合は、[`redirect`](/docs/app-router/api-reference/functions/redirect)と任意の絶対 URL または相対 URL を使用できます：

```ts title="app/actions.ts"
'use server'

import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export default async function submit() {
  const id = await addPost()
  revalidateTag('posts') // キャッシュされたpostsを更新
  redirect(`/post/${id}`) // 新しいルートへナビゲート
}
```

### フォームのバリデーション

基本的なフォームバリデーションには、`required`や`type="email"`などの HTML バリデーションを使うことをお勧めします。

より高度なサーバーサイドバリデーションには、[zod](https://zod.dev/)のようなスキーマバリデーションライブラリを使用して、解析されたフォームデータの構造を検証します：

```ts title="app/actions.ts"
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function submit(formData: FormData) {
  const parsed = schema.parse({
    id: formData.get('id'),
  })
  // ...
}
```

### ロードの状態を表示する

[`useFormStatus`](https://ja.react.dev/reference/react-dom/hooks/useFormStatus)フックを使用して、サーバー上でフォームが送信されているときにロード状態を表示します。`useFormStatus`フックは、Server Action を使用する `form`要素の子要素としてのみ使用できます。

例えば、次のような送信ボタンです：

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

`<SubmitButton />`は、Server Action を持つフォームで使うことができます：

```tsx title="app/page.tsx"
import { SubmitButton } from '@/app/submit-button'

export default async function Home() {
  return (
    <form action={...}>
      <input type="text" name="field-name" />
      <SubmitButton />
    </form>
  )
}
```

### エラーハンドリング

Server Actions は[シリアライズ可能なオブジェクト](https://developer.mozilla.org/docs/Glossary/Serialization)を返すこともできます。例えば、Server Action は新規アイテムの作成時のエラーを処理できます：

```ts title="app/actions.ts"
'use server'

export async function createTodo(prevState: any, formData: FormData) {
  try {
    await createItem(formData.get('todo'))
    return revalidatePath('/')
  } catch (e) {
    return { message: 'Failed to create' }
  }
}
```

そして、Client Component からこの値を読み取り、エラーメッセージを表示できます。

```tsx title="app/add-form.tsx"
'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { createTodo } from '@/app/actions'

const initialState = {
  message: null,
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" aria-disabled={pending}>
      Add
    </button>
  )
}

export function AddForm() {
  const [state, formAction] = useFormState(createTodo, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="todo">Enter Task</label>
      <input type="text" id="todo" name="todo" required />
      <SubmitButton />
      <p aria-live="polite" className="sr-only">
        {state?.message}
      </p>
    </form>
  )
}
```

### 楽観的な更新

[`UseOptimistic`](https://ja.react.dev/reference/react/useOptimistic)を使用すると、応答を待つのではなく、Server Action が終了する前に UI を楽観的に更新します：

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

### クッキーのセット

Server Action の内部で[`cookies`](/docs/app-router/api-reference/functions/cookies)関数を使ってクッキーをセットできます：

```ts title="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function create() {
  const cart = await createCart()
  cookies().set('cartId', cart.id)
}
```

### クッキーの読み込み

Server Action の内部で[`cookies`](/docs/app-router/api-reference/functions/cookies)関数を使ってクッキーを読むことができます：

```ts title="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function read() {
  const auth = cookies().get('authorization')?.value
  // ...
}
```

### クッキーの削除

Server Action の内部で[`cookies`](/docs/app-router/api-reference/functions/cookies)関数を使ってクッキーを削除できます：

```ts title="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function delete() {
  cookies().delete('name')
  // ...
}
```

クッキーの削除については、Server Actions の[追加例](/docs/app-router/api-reference/functions/cookies#deleting-cookies)を参照してください。
