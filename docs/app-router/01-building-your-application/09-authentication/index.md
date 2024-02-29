---
title: 認証
description: Next.js で認証を実装する方法、ベストプラクティス、ルートの保護、認可手法、セッション管理について学びます。
---

Next.js で認証を実装するために、以下の3つの基本的な概念について熟知する必要があります:

- **[認証](#認証)**はユーザーが自己主張するとおりのユーザーであるかを検証します。ユーザー名とパスワードなど、自己の身元を証明できるものを必要とします。
- **[セッション管理](#セッション管理)**は複数のリクエストを跨いでユーザーの状態（例えばログインしているか）を追跡します。
- **[認可](#認可)**はユーザーがアプリケーションのどの部分にアクセスを許可するかを決定します。

このページでは、Next.js の機能を使用して一般的な認証、認可、セッション管理のパターンを実装する方法を示し、アプリケーションのニーズに基づいて最適な解決策を選択するためのガイドを示します。

## 認証

認証はユーザーの身元を確認します。これはユーザーがログインする際に行われ、ユーザー名とパスワードを使用するか、Google のようなサービスを通じて行われます。ユーザーが本当にユーザー自身であることを確認し、ユーザーのデータやアプリケーションを不正アクセスや詐欺行為から保護することに重点を置いています。

### 認証ストラテジー

現代のウェブアプリケーションでは、通常以下のような認証ストラテジーが使用されます:

1. **OAuth / OpenID Connect (OIDC)**: ユーザーの資格情報を共有せずにサードパーティアクセスを可能にします。ソーシャルメディアログインやシングルサインオン（SSO）に最適です。OpenID Connect によりアイデンティティ層を追加します。
2. **資格情報に基づくログイン（メールとパスワード）**: ユーザーがメールアドレスとパスワードを使用してログインするウェブアプリケーションにおいて標準的な選択です。使い慣れていて実装が容易ですが、フィッシングなどの脅威に対する強固なセキュリティ対策が必要です。
3. **パスワードレス / トークンベースの認証**: メールのマジックリンクやSMSのワンタイムコードを使用して、パスワード不要で安全にアクセスできます。その便利さと強化されたセキュリティにより人気があり、パスワードの管理コストを軽減します。ただし、ユーザーのメールや電話が利用できるかどうかに依存し制限もあります。
4. **パスキー / WebAuthn**: 各サイトごとに一意の暗号化された資格情報を使用します、フィッシングに対する高いセキュリティを提供します。安全ですが新しいこの戦略は実装が難しくなる可能性もあります。

認証ストラテジーの選択は、アプリケーションの特定の要件、ユーザーインターフェースの要件、セキュリティ目標と整合性を持たせるべきです。

### 認証の実装

このセクションでは、ウェブアプリケーションに基本的なメールとパスワードによる認証を追加するプロセスを探ります。この方法は基本的なセキュリティを提供しますが、一般的なセキュリティ脅威に対するより強力な保護のために、OAuthやパスワードレスログインなどのより高度なオプションを検討する価値はあります。

これから説明する認証フローは次のとおりです。

1. ユーザーがログインフォームを通じて自分の認証情報をサブミットする
2. フォームから API ルートにリクエストが送信され、処理される
3. 検証が成功すると、プロセスが完了し、ユーザーの認証成功を示す
4. 検証が失敗した場合、エラーメッセージが表示される

認証情報を入力できるログインフォームを考えてみてください:

```tsx title="app/login/page.tsx"
import { authenticate } from '@/app/lib/actions'
 
export default function Page() {
  return (
    <form action={authenticate}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  )
}
```

上記のフォームには、ユーザーのメールアドレスとパスワードを入力するための2つの入力フィールドがあります。フォームが送信されると、`authenticate` Server Actionを呼び出します。

次に、Server Action で認証プロバイダーの API の呼び出し、認証のリクエストを処理します:

```ts title="app/lib/actions.ts"
'use server'
 
import { signIn } from '@/auth'
 
export async function authenticate(formData: FormData) {
  try {
    await signIn('credentials', formData)
  } catch (error) {
    if (error) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.'
        default:
          return 'Something went wrong.'
      }
    }
    throw error
  }
}
```

このコードにおいて、`signIn`メソッドは、認証情報と保存されているユーザーデータを照合します。認証プロバイダが認証情報を処理した後、次の2つの結果を返す可能性があります:

- **認証成功**:この結果は、ログインが成功したことを示します。これ以降、保護されたルートへのアクセスやユーザー情報の取得など、続くアクションを開始できます。
- **認証失敗**:認証情報が間違っていたり、エラーが発生した場合など、この関数は認証の失敗に対応するエラーメッセージを返します。

<!-- textlint-disable -->
最後に `login-form.tsx` コンポーネントでは、React の `useFormState` を使用して Server Action を呼び出し、フォームのエラー処理と`useFormStatus`を使用してフォームの状態を処理できます:
<!-- textlint-enable -->

```tsx title="app/login/page.tsx"
'use client'
 
import { authenticate } from '@/app/lib/actions'
import { useFormState, useFormStatus } from 'react-dom'
 
export default function Page() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined)
 
  return (
    <form action={dispatch}>
      <input type="email" name="email" placeholder="Email" required />
      <input type="password" name="password" placeholder="Password" required />
      <div>{errorMessage && <p>{errorMessage}</p>}</div>
      <LoginButton />
    </form>
  )
}
 
function LoginButton() {
  const { pending } = useFormStatus()
 
  return (
    <button aria-disabled={pending} type="submit">
      Login
    </button>
  )
}
```

Next.js プロジェクトで、より合理的に認証設定を行うには、特に複数のログイン方法を提供する場合は、包括的な[認証ソリューション](#例)の使用を検討してください。


## 認可

ユーザーが認証されたら、次に特定のルートへのアクセス許可と、Server Action でのデータの変更や Route Handlers の呼び出しといった操作のための認可が必要となります。

### Middleware でのルート保護

[Middleware](/docs/app-router/building-your-application/routing/middleware)は Next.js でウェブサイトのさまざまな部分へのアクセスを制御するための便利な機能です。これにより、ユーザーダッシュボードなどの領域を保護しながら、マーケティングページなどの公開ページを作成できます。すべてのルートに対して Middleware を適用し、アクセスを公開するルートだけを除外するように設定することを推奨します。

Next.js での認証のための Middleware 実装方法は以下のとおりです: 

1. **Middleware の設定:**
  - プロジェクトのルートディレクトリに`middleware.ts`または`.js`ファイルを作成します
  - ユーザーアクセスの認証など、認証トークンのチェックのようなロジックを含めます
2. **保護対象のルートの定義:**
  - すべてのルートが認可を必要とするわけではありません。Middlewareの`matcher`オプションを使用して、認可チェックが不要なルートを指定します
3. **Middleware のロジック:**
  - ユーザーが認証されているかどうかを確認するロジックを記述します。ルートの認可のためにユーザーロールや権限のチェックを行います
4. **認可されていないアクセスのハンドリング:**
  - 認可されていないユーザーをログインページやエラーページにリダイレクトします

Middleware ファイルの例:

```tsx title="middleware.ts"
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('currentUser')?.value

  if (currentUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

この例では[`NextResponse.redirect`](/docs/app-router/api-reference/functions/next-response#redirect)がリクエストパイプラインの早い段階でリダイレクトを処理するために使用されており、アクセス制御が集中化され効率的に行われています。

特定のリダイレクトが必要な場合は、Server Components、Route Handlers、および Server Actions で `redirect` 関数を使用して、より詳細に制御できます。これは、ロールベースのナビゲーションやコンテキスト依存のシナリオに便利です。

```tsx title="app/page.tsx"
import { redirect } from 'next/navigation'
 
export default function Page() {
  // リダイレクトが必要かどうかを判断するロジック
  const accessDenied = true
  if (accessDenied) {
    redirect('/login')
  }
 
  // その他のルートとロジックを定義する
}
```

認証に成功した後は、ユーザーのロールに基づいてユーザーのナビゲーションを管理することが重要です。例えば、管理者ユーザーは管理者ダッシュボードにリダイレクトされ、一般ユーザーは別のページに送られるかもしれません。これは、役割に応じたユーザー体験や、必要に応じてユーザーにプロフィールの入力を促すような条件付きのナビゲーションを行ううえで重要です。

認可する際は、アプリケーションがデータにアクセスしたりデータを変更したりする場所で主要なセキュリティチェックを行うことが重要です。Middleware は初期のバリデーションには有用ですが、データを保護するための唯一の防衛線であってはなりません。セキュリティチェックの大部分はデータアクセスレイヤー（DAL）で行うべきです。

このアプローチは、[このセキュリティに関するブログ](https://nextjs.org/blog/security-nextjs-server-components-actions)でハイライトされ、専用の DAL 内にすべてのデータアクセスを集約することを提唱しています。この戦略は、一貫したデータアクセスを確保し、認証に関するバグを最小限に抑えることで、メンテナンスを簡素化します。包括的なセキュリティを確保するために、以下の主要な領域で処理を行うことを考慮してください:

- Server Actions: 特にセンシティブな操作に対しては、サーバーサイドのプロセスにセキュリティチェックを実装します。
- Route Handlers: アクセスが許可されたユーザーに限定されるよう、セキュリティ対策を施してリクエストを管理します。
- Data Access Layer (DAL): データベースと直接やりとりし、データ・トランザクションの妥当性確認と承認に重要な役割を果たします。DAL内で重要なチェックを行い、もっとも重要なインタラクションポイントであるアクセスや変更においてデータを保護することが重要です。

DAL のセキュリティを確保するための詳細なガイド、例えばコードスニペットや高度なセキュリティ対策については、セキュリティガイドの[Data Access Layer のセクション](https://nextjs.org/blog/security-nextjs-server-components-actions#data-access-layer)を参照してください。

### Server Actions の保護

<!-- TODO: Fix link -->
[Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations) を扱う際には、公開されている API エンドポイントと同じセキュリティを考慮することが重要です。各アクションに対するユーザーの認証を確認することが重要です。Server Action 内でユーザーの権限を判断するチェックを実装します。例えば、特定のアクションを管理者ユーザーに限定します。

以下の例では、アクションの処理を続ける前にユーザーのロールを確認します:

```ts title="app/lib/actions.ts"
'use server'

// ...

export async function serverAction() {
  const session = await getSession()
  const userRole = session?.user?.role

  // ユーザーがアクションを実行する権限があるかどうかをチェック
  if (userRole !== 'admin') {
    throw new Error('Unauthorized access: User does not have admin privileges.')
  }

  // 認証済みのユーザーに対してアクションを続ける
  // ... アクションの実装
}
```

### Route Handlers の保護

Next.jsの Route Handlers は、入力リクエストの管理に重要な役割を果たします。Server Actions と同様に、特定の機能に対するアクセスが認証済みのユーザーのみであることを保証するように、セキュリティを確保すべきです。これは通常、ユーザーの認証状態と権限の検証を含みます。

以下は、Route Handlers の保護の一例です:

```ts title="app/api/route.ts"
export async function GET() {
  // ユーザーの認証と役割の検証
  const session = await getSession()

  // ユーザーが認証されているかどうかをチェック
  if (!session) {
    return new Response(null, { status: 401 }) // ユーザーが認証されていない
  }

  // ユーザーが 'admin' ロールを持っているかどうかをチェック
  if (session.user.role !== 'admin') {
    return new Response(null, { status: 403 }) // ユーザーは認証されているが、適切な権限を持っていない
  }

  // 認可されたユーザーのためのデータのフェッチ
}
```

この例では、認証と認可の2段階のセキュリティチェックを持つ Route Handlers を示しています。まず、アクティブなセッションがあるかどうかをチェックし、次にログインユーザーが 'admin' であるかどうかを確認します。このアプローチは、認証済みで認可されたユーザーのみに限定した安全なアクセスを保証し、リクエスト処理の堅固なセキュリティを維持します。

### Server Component を用いた認可

Next.js の [Serve Components](/docs/app-router/building-your-application/rendering/server-components) は、サーバー側での実行を目的として設計されており、認可のような複雑なロジックを統合するための安全な環境を提供します。これにより、バックエンドのリソースに直接アクセスでき、データ重視のタスクのパフォーマンスを最適化し、機密の操作のセキュリティを強化します。

Server Components では、一般的にはユーザーのロールに基づいてUI要素を条件付きでレンダリングすることが一般的です。このアプローチにより、ユーザーが閲覧することを許可されたコンテンツのみにアクセスすることが確保され、ユーザー体験とセキュリティが強化されます。

**例: **

```tsx title="app/dashboard/page.tsx"
export default function Dashboard() {
  const session = await getSession()
  const userRole = session?.user?.role // 'role'がセッションオブジェクトの一部であると仮定

  if (userRole === 'admin') {
    return <AdminDashboard /> // 管理者ユーザーのためのコンポーネント
  } else if (userRole === 'user') {
    return <UserDashboard /> // 一般ユーザーのためのコンポーネント
  } else {
    return <AccessDenied /> // 認証が拒否された場合に表示されるコンポーネント
  }
}
```

この例では、Dashboardコンポーネントは 'admin'、'user' および認証されていないロールを持つユーザーに対して異なるUIをレンダリングします。このパターンにより、各ユーザーが自身の役割に適したコンポーネントとのみ対話することが確保され、セキュリティとユーザー体験の両方が強化されます。

### ベストプラクティス

- **セキュアなセッション管理**: 不正アクセスやデータ侵害を防止するために、セッションデータのセキュリティを優先的に管理します。暗号化とセキュアなストレージを使用します。
- **ダイナミックなロール管理**: ユーザーのロールに対する柔軟なシステムを使用して、権限とロールの変化に簡単に対応します。これにより、ロールのハードコードを防ぎます。
- **セキュリティ優先のアプローチ**: 認可ロジックのすべての側面で、ユーザーデータの保護とアプリケーションの整合性の維持を確保するために、セキュリティを優先します。これには、徹底的なテストと潜在的なセキュリティ脆弱性を考慮することが含まれます。

## セッション管理

セッション管理とは、ユーザーのアプリケーションとのやり取りを追跡し、ユーザーの認証状態がアプリケーションのさまざまな部分で維持されることを保証するものです。

これにより、何度もログインする必要がなくなり、セキュリティとユーザー利便性の両方が向上します。セッション管理には主に2つのメソッドが使用されます: クッキーベースのセッションとデータベースセッションです。

### クッキーベースのセッション

> **🎥 動画を見る:** クッキーベースのセッションと Next.js による認証について学ぶ → [YouTube (11分)](https://www.youtube.com/watch?v=DJvM2lSPn6w).

クッキーベースのセッションは、暗号化されたセッション情報を直接ブラウザのクッキーに保存することでユーザーデータを管理します。ユーザーがログインすると、この暗号化されたデータがクッキーに保存されます。それ以降のサーバーリクエストごとに、このクッキーが含まれ、サーバーへの繰り返しのクエリが最小化され、クライアント側の効率が向上します。

しかし、この方法ではクッキーがクライアント側のセキュリティリスクにさらされるため、慎重な暗号化が必要です。クッキー内のセッションデータを暗号化することは、ユーザー情報を不正アクセスから保護するための重要です。クッキーが盗まれても、中のデータは読めない状態になります。

個々のクッキーのサイズは制限（通常は約4KB周り）されていますが、クッキー・チャンキングという技術を用いることで、大きなセッションデータを複数のクッキーに分割し、この制限を克服できます。

Next.js のプロジェクトでのクッキーの設定は例えば以下のようになります:

**サーバーでのクッキーの設定:**

```ts title="app/actions.ts"
'use server'

import { cookies } from 'next/headers'

export async function handleLogin(sessionData) {
  const encryptedSessionData = encrypt(sessionData) // セッションデータを暗号化
  cookies().set('session', encryptedSessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1週間
    path: '/',
  })
  // クッキーを設定した後のリダイレクトやレスポンスを処理する
}
```

**Server Components 内でクッキーに保存されたセッションデータへアクセスする:**

```tsx title="app/page.tsx"
import { cookies } from 'next/headers'

export async function getSessionData(req) {
  const encryptedSessionData = cookies().get('session')?.value
  return encryptedSessionData ? JSON.parse(decrypt(encryptedSessionData)) : null
}
```

### データベースセッション

データベースによるセッション管理では、セッションデータをサーバーに保存し、ユーザーのブラウザにはセッション ID のみを送信します。このIDは、データ自体を含まずに、サーバーサイドに保存されたセッションデータを参照します。この方法は、セッションデータをクライアントサイドの環境から遠ざけてセキュリティを強化し、クライアントサイドの攻撃に対する露出リスクを減らします。データベースセッションは、大規模なデータストレージ要件に対応できるため、よりスケーラブルです。

しかし、このアプローチにはトレードオフがあります。ユーザーのインタラクションごとにデータベースのルックアップが必要になるため、パフォーマンスのオーバーヘッドになることがあります。セッションデータのキャッシングなどの戦略でこれを緩和できます。さらに、データベースへの依存という特性上、セッション管理の信頼性はデータベースのパフォーマンスと可用性に直結しています。

次に、Next.js アプリケーションでのデータベースセッションの実装例を簡単に示します。

**サーバー上でセッションを作成する**:

```js
import db from './lib/db'

export async function createSession(user) {
  const sessionId = generateSessionId() // 一意のセッションIDを生成
  await db.insertSession({ sessionId, userId: user.id, createdAt: new Date() })
  return sessionId
}
```

**Middleware またはサーバーサイドロジックでセッションを取得する**:

```js
import { cookies } from 'next/headers'
import db from './lib/db'

export async function getSession() {
  const sessionId = cookies().get('sessionId')?.value
  return sessionId ? await db.findSession(sessionId) : null
}
```

### Next.js におけるセッション管理の選択

Next.js でクッキーベースのセッションとデータベースセッションのどちらを選択するかは、アプリケーションのニーズによります。クッキーベースのセッションは簡単で、サーバー負荷が低い小さなアプリケーションに適していますが、セキュリティ面で劣る場合があります。データベースセッションはより複雑ですが、より良いセキュリティとスケーラビリティを提供し、大規模で不正なアクセスから守らなければならないデータを扱うアプリケーションに最適です。

[NextAuth.js](https://authjs.dev/guides/upgrade-to-v5) などの[認証ソリューション](#例)を使用すると、セッション管理はクッキーまたはデータベースストレージのいずれかを使用して、より効率的になります。このソリューションは開発プロセスを単純化しますが、選択したソリューションが使用するセッション管理方法を理解することが重要です。それがあなたのアプリケーションのセキュリティとパフォーマンスの要求と一致していることを確認してください。

あなたの選択に関係なく、セッション管理戦略においてセキュリティを優先してください。クッキーベースのセッションでは、セッションデータを保護するために、安全かつ HTTP-Only なクッキーの使用が重要です。データベースセッションでは、定期的なバックアップとセッションデータの安全な取り扱いが不可欠です。セッションの有効期限とクリーンアップメカニズムの実装は、両方のアプローチにおいて不正アクセスを防止し、アプリケーションのパフォーマンスと信頼性を維持するために重要です。

## 例

以下に Next.js と互換性のある認証ソリューションを示します。下記のクイックスタートガイドを参照して、Next.js アプリケーションでこれらを設定する方法を学んでください:

<!-- TODO: 新しいドキュメンテーションが完成したらauthjs.devにリンクを変更 -->

- [Auth0](https://auth0.com/docs/quickstart/webapp/nextjs/01-login)
- [Clerk](https://clerk.com/docs/quickstarts/nextjs)
- [Corbado](https://www.corbado.com/passkeys/next-js)
- [Kinde](https://kinde.com/docs/developer-tools/nextjs-sdk)
- [Lucia](https://lucia-auth.com/getting-started/nextjs-app)
- [NextAuth.js](https://authjs.dev/guides/upgrade-to-v5)
- [Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Stytch](https://stytch.com/docs/guides/quickstarts/nextjs)
- [Iron Session](https://github.com/vvo/iron-session)

## さらに詳しく

認証とセキュリティについてさらに学ぶために、以下のリソースをチェックしてみてください:

- [XSS攻撃を理解する](https://vercel.com/guides/understanding-xss-attacks)
- [CSRF攻撃を理解する](https://vercel.com/guides/understanding-csrf-attacks)
