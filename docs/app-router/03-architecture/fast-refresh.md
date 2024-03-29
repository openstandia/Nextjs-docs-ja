---
title: ファストリフレッシュ
description: ファストリフレッシュは、Reactコンポーネントの編集に対して瞬時のフィードバックを提供するホットモジュールリローディングの機能です。
---

ファストリフレッシュは、React コンポーネントの編集に対して瞬時のフィードバックを提供する Next.js の機能です。
ファストリフレッシュは Next.js の **9.4 以降** のバージョンでデフォルトで有効化されています。
Next.js でファストリフレッシュが有効になっている場合、ほとんどの編集内容は 1 秒以内に表示されます。
また、**コンポーネントの状態も失われることはありません。**

## 仕組み

- **React コンポーネントのみがエクスポートされている**ファイルを編集した場合、ファストリフレッシュはそのファイルのコードのみを更新し、コンポーネントを再描画します。スタイルやレンダリングロジック、イベントハンドラ、エフェクトなど、そのファイル内のどんな部分でも編集することができます。
- React コンポーネント _以外_ のエクスポートが含まれているファイルを編集した場合、ファストリフレッシュはそのファイルだけでなく、それをインポートしている他のファイルも再評価します。たとえば、`Button.js` と `Modal.js` の両方が `theme.js` をインポートしている場合、`theme.js` を編集すると両方のコンポーネントが更新されます。
- 最後に、**React ツリー外でインポート**されている**ファイルを編集**した場合、ファストリフレッシュは**完全なリロードを行います**。React コンポーネントをレンダリングするファイルであると同時に、**非 React コンポーネント**がそのファイルをインポートしている場合があります。たとえば、コンポーネントが定数をエクスポートし、非 React のユーティリティファイルがそれをインポートしている場合です。この場合、定数を別のファイルに移動し、両方のファイルでインポートすることを検討してください。これにより、ファストリフレッシュが再度動作するようになります。他のケースも通常は同様の方法で解決できます。

## エラーの回復力

### 構文エラー

開発中に構文エラーが発生した場合、修正してファイルを再保存することができます。
エラーは自動的に消えるため、アプリを再読み込みする必要はありません。**コンポーネントの状態は失われません**。

### ランタイムエラー

コンポーネント内でランタイムエラーが発生すると、コンテキストオーバーレイが表示されます。
エラーを修正すると、オーバーレイは自動的に閉じられ、アプリの再読み込みは必要ありません。

エラーがレンダリング中に発生しなかった場合、コンポーネントの状態は保持されます。
ただし、エラーがレンダリング中に発生した場合、React は更新されたコードを使用してアプリを再マウントします。

もしあなたのアプリに[エラーバウンダリ](https://ja.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)がある場合（本番環境での優れたエラーハンドリングのためには良いアイデアです）、エラーが発生した後の編集で再度レンダリングが試行されます。
これにより、エラーバウンダリが常にルートアプリの状態にリセットされることを防ぐことができます。
ただし、エラーバウンダリが _あまりに_ 細かすぎないように注意してください。
エラーバウンダリは React によって本番環境で使用されるため、意図的に設計される必要があります。

## 制限事項

ファストリフレッシュは、編集しているコンポーネントのローカルな React の状態を保存しようとしますが、安全な場合に限ります。
次に、ファイルを編集するたびにローカルな状態がリセットされる理由のいくつかを示します。

- ローカルな状態は、クラスコンポーネントでは保存されません（関数コンポーネントとフックのみが状態を保存します）。
- 編集しているファイルには、React コンポーネントに加えて _他の_ エクスポートがあるかもしれません。
- しばしば、ファイルは `HOC(WrappedComponent)` のような高階層のコンポーネントの呼び出し結果をエクスポートすることがあります。返されたコンポーネントがクラスである場合、その状態はリセットされます。
- `export default () => <div />;`のような匿名のアロー関数は、ファストリフレッシュがローカルなコンポーネントの状態を保持しないようにします。大規模なコードベースでは、[`name-default-component` codemod](/docs/app-router/building-your-application/upgrading/codemods#name-default-component) を使用することができます。

コードベースが関数コンポーネントとフックに移行するにつれて、状態がより多くの場合に保持されることが期待できます。

## Tips

- ファストリフレッシュは、デフォルトで関数コンポーネント（およびフック）の React ローカルな状態を保持します。
- 時には、_強制的に_ 状態をリセットし、コンポーネントを再マウントしたい場合があります。たとえば、マウント時にのみ発生するアニメーションを微調整する場合などに便利です。これを行うには、編集しているファイルの任意の場所に `// @refresh reset` を追加します。この指示はファイル内に閉じたものであり、ファストリフレッシュに対してそのファイルで定義されたコンポーネントを編集するたびに再マウントするよう命令します。
- 開発中に編集するコンポーネントに `console.log` や `debugger;` を挿入することができます。
- インポートは大文字と小文字を区別します。インポートが実際のファイル名と一致しない場合、高速リフレッシュと完全リフレッシュの両方が失敗することがあります。
  たとえば、`'./header'` と `'./Header'` のような場合です。

## ファストリフレッシュとフック

可能な場合、ファストリフレッシュはコンポーネントの状態を編集の間保持しようとします。
特に、`useState` と `useRef` は、引数やフックの呼び出しの順序を変更しない限り、前の値を保持します。

`useEffect`、`useMemo`、`useCallback` などの依存関係を持つフックは、ファストリフレッシュ中に _必ず_ 更新されます
ファストリフレッシュ中には、依存関係のリストは無視されます。

たとえば、`useMemo(() => x * 2, [x])` を `useMemo(() => x * 10, [x])` に編集した場合、`x`（依存関係）が変更されていないにも関わらず、再実行されます。React がこれを行わない場合、編集内容が画面に反映されません！

これは、予期しない結果を招くことがあるかもしれません。たとえば、依存関係の配列が空の `useEffect` でも、ファストリフレッシュ中に一度は再実行されます。

ただし、`useEffect` の再実行に対して強靭なコードを書くことは、ファストリフレッシュがなくても推奨される良い慣習です。
後から新しい依存関係を導入することが容易になりますし、[React Strict Mode](/docs/app-router/api-reference/next-config-js/reactStrictMode) でも強制されていますので、有効化することを強くお勧めします。
