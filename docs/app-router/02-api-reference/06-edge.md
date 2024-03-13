---
title: Edge Runtime
description: Edge Runtime の API リファレンスです。
---

Next.js Edge ランタイムは標準的な Web API をベースにしており、以下の API をサポートしています：

## Network APIs

| API                                                                                   | 説明                     |
| ------------------------------------------------------------------------------------- | ------------------------ |
| [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob)                       | blob                     |
| [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)                 | リソースをフェッチする   |
| [`FetchEvent`](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent)           | fetch イベント           |
| [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File)                       | ファイル                 |
| [`FormData`](https://developer.mozilla.org/en-US/docs/Web/API/FormData)               | フォームデータ           |
| [`Headers`](https://developer.mozilla.org/en-US/docs/Web/API/Headers)                 | HTTP ヘッダー            |
| [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request)                 | HTTP リクエスト          |
| [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)               | HTTP レスポンス          |
| [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) | URL の search パラメータ |
| [`WebSocket`](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)             | websocket 接続           |

## Encoding APIs

| API                                                                                       | 説明                                           |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------- |
| [`atob`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob) | Base-64 エンコードされた文字列をデコードする　 |
| [`btoa`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/btoa) | 文字列を base-64 でエンコードする　            |
| [`TextDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder)             | Uint8Array を文字列にデコードする              |
| [`TextDecoderStream`](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoderStream) | チェーン可能なストリーム用デコーダ　           |
| [`TextEncoder`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)             | 文字列を Uint8Array にエンコードする           |
| [`TextEncoderStream`](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoderStream) | ストリーム用のチェーン可能なエンコーダー　     |

## Stream APIs

| API                                                                                                           | 説明                      |
| ------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)                           | 読み取り可能なストリーム  |
| [`ReadableStreamBYOBReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamBYOBReader)       | ReadableStream のリーダー |
| [`ReadableStreamDefaultReader`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStreamDefaultReader) | ReadableStream のリーダー |
| [`TransformStream`](https://developer.mozilla.org/en-US/docs/Web/API/TransformStream)                         | 変換ストリーム            |
| [`WritableStream`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStream)                           | 書き込み可能なストリーム  |
| [`WritableStreamDefaultWriter`](https://developer.mozilla.org/en-US/docs/Web/API/WritableStreamDefaultWriter) | WritableStream のライター |

## Crypto APIs

| API                                                                             | 説明                                                                               |
| ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`crypto`](https://developer.mozilla.org/en-US/docs/Web/API/Window/crypto)      | プラットフォームの暗号機能へのアクセスを提供する                                   |
| [`CryptoKey`](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)       | 暗号鍵                                                                             |
| [`SubtleCrypto`](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) | ハッシュ、署名、暗号化、復号化などの一般的な暗号プリミティブへのアクセスを提供する |

## Web Standard APIs

| API                                                                                                                         | 説明                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)                                       | 1 つまたは複数の DOM リクエストを中断する                                                                                                                                                            |
| [`Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)                           | 値の配列                                                                                                                                                                                             |
| [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)               | 一般的な固定長の生バイナリデータバッファ                                                                                                                                                             |
| [`Atomics`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics)                       | アトミック操作を静的メソッドとして提供する                                                                                                                                                           |
| [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)                         | 任意の精度の整数                                                                                                                                                                                     |
| [`BigInt64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt64Array)           | 64 ビット符号付き整数の型付き配列                                                                                                                                                                    |
| [`BigUint64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigUint64Array)         | 64 ビット符号なし整数の型付き配列                                                                                                                                                                    |
| [`Boolean`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)                       | 論理的な実体を表し、`true`と`false`の 2 つの値を持つ                                                                                                                                                 |
| [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearInterval)                 | `setInterval()`のコールによって確立された、時間指定の繰り返しアクションをキャンセルする                                                                                                              |
| [`clearTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/clearTimeout)                   | `setTimeout()`のコールによって確立された、時間指定の繰り返しアクションをキャンセルする                                                                                                               |
| [`console`](https://developer.mozilla.org/en-US/docs/Web/API/Console)                                                       | ブラウザのデバッグ・コンソールにアクセスする                                                                                                                                                         |
| [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)                     | `ArrayBuffer`の一般的なビュー                                                                                                                                                                        |
| [`Date`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)                             | プラットフォームに依存しないフォーマットで、ある一瞬を表す                                                                                                                                           |
| [`decodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURI)                   | `encodeURI`または同様のルーチンで以前に作成された統一資源識別子(URI)をデコードする                                                                                                                   |
| [`decodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) | `encodeURIComponent`または同様のルーチンで以前に作成された統一資源識別子（URI）コンポーネントをデコードする                                                                                          |
| [`DOMException`](https://developer.mozilla.org/en-US/docs/Web/API/DOMException)                                             | DOM で発生したエラー                                                                                                                                                                                 |
| [`encodeURI`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI)                   | 特定の文字の各インスタンスを、その文字の UTF-8 エンコーディングを表す 1 つ、2 つ、3 つ、または 4 つのエスケープシーケンスで置き換えることによって、統一資源識別子(URI)をエンコードする               |
| [`encodeURIComponent`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) | 特定の文字の各インスタンスを、その文字の UTF-8 エンコーディングを表す 1 つ、2 つ、3 つ、または 4 つのエスケープシーケンスで置き換えることによって、統一資源識別子(URI)コンポーネントをエンコードする |
| [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)                           | 文を実行しようとしたとき、またはプロパティにアクセスしようとしたときのエラー                                                                                                                         |
| [`EvalError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/EvalError)                   | グローバル関数`eval()`に関して発生したエラー                                                                                                                                                         |
| [`Float32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array)             | 32 ビット浮動小数点数の型付き配列                                                                                                                                                                    |
| [`Float64Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float64Array)             | 64 ビット浮動小数点数の型付き配列                                                                                                                                                                    |
| [`Function`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)                     | 関数                                                                                                                                                                                                 |
| [`Infinity`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Infinity)                     | 数学的な無限大の値                                                                                                                                                                                   |
| [`Int8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array)                   | 8 ビット符号付き整数の型付き配列                                                                                                                                                                     |
| [`Int16Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array)                 | 16 ビット符号付き整数の型付き配列                                                                                                                                                                    |
| [`Int32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int32Array)                 | 32 ビット符号付き整数の型付き配列                                                                                                                                                                    |
| [`Intl`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)                             | 国際化およびローカリゼーション機能へのアクセスを提供する                                                                                                                                             |
| [`isFinite`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isFinite)                     | 値が有限であるかどうかを判定する                                                                                                                                                                     |
| [`isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN)                           | 値が`NaN`かどうかを判定する                                                                                                                                                                          |
| [`JSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)                             | JavaScript の値を JSON 形式に変換する機能を提供する                                                                                                                                                  |
| [`Map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)                               | 値の集合を表し、各値は一度しか出現しない                                                                                                                                                             |
| [`Math`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)                             | 数学関数と定数へのアクセスを提供する                                                                                                                                                                 |
| [`Number`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)                         | 数値                                                                                                                                                                                                 |
| [`Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)                         | すべての JavaScript オブジェクトのベースとなるオブジェクト                                                                                                                                           |
| [`parseFloat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat)                 | 文字列引数を解析し、浮動小数点数を返す                                                                                                                                                               |
| [`parseInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt)                     | 文字列引数をパースし、指定された基数の整数を返す                                                                                                                                                     |
| [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)                       | 非同期操作の最終的な完了（または失敗）とその結果                                                                                                                                                     |
| [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)                           | 基本的な操作（プロパティ参照、代入、列挙、関数呼び出しなど）のカスタム動作を定義するために使用されるオブジェクト                                                                                     |
| [`queueMicrotask`](https://developer.mozilla.org/en-US/docs/Web/API/queueMicrotask)                                         | 実行するマイクロタスクをキューに入れる                                                                                                                                                               |
| [`RangeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RangeError)                 | 値が許容値のセットまたは範囲にない場合のエラー                                                                                                                                                       |
| [`ReferenceError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)         | 存在しない変数が参照された場合のエラー                                                                                                                                                               |
| [`Reflect`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect)                       | JavaScript 操作を受け付けるためのメソッドを提供する                                                                                                                                                  |
| [`RegExp`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)                         | 正規表現を表し、文字の組み合わせにマッチする                                                                                                                                                         |
| [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set)                               | 値の集合を表し、各値は一度しか出現しない                                                                                                                                                             |
| [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)                                               | 各呼び出しの間に一定の時間遅延を置いて、関数を繰り返し呼び出す                                                                                                                                       |
| [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout)                                                 | 指定したミリ秒後に関数を呼び出すか、式を評価する                                                                                                                                                     |
| [`SharedArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer)   | 一般的な固定長の生バイナリデータバッファ                                                                                                                                                             |
| [`String`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)                         | 文字列                                                                                                                                                                                               |
| [`structuredClone`](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)            | 値のディープコピーを作成する                                                                                                                                                                         |
| [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)                         | オブジェクト・プロパティのキーとして使用される、ユニークで不変なデータ型                                                                                                                             |
| [`SyntaxError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)               | 構文的に無効なコードを解釈しようとしたときのエラー                                                                                                                                                   |
| [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError)                   | 値が期待された型でない場合のエラー                                                                                                                                                                   |
| [`Uint8Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)                 | 8 ビット符号なし整数の型付き配列                                                                                                                                                                     |
| [`Uint8ClampedArray`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8ClampedArray)   | 0 ～ 255 にクランプされた 8 ビット符号なし整数の型付き配列                                                                                                                                           |
| [`Uint32Array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array)               | 32 ビット符号なし整数の型付き配列                                                                                                                                                                    |
| [`URIError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/URIError)                     | グローバル URI 処理関数が誤った方法で使用された場合のエラー                                                                                                                                          |
| [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)                                                               | オブジェクトの URL を作成するための静的メソッドを提供するオブジェクト                                                                                                                                |
| [`URLPattern`](https://developer.mozilla.org/en-US/docs/Web/API/URLPattern)                                                 | URL パターン                                                                                                                                                                                         |
| [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)                                       | キーと値のペアのコレクション                                                                                                                                                                         |
| [`WeakMap`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)                       | キーが弱く参照される、キーと値のペアのコレクション                                                                                                                                                   |
| [`WeakSet`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)                       | オブジェクトのコレクションを表し、各オブジェクトは一度しか出現しない                                                                                                                                 |
| [`WebAssembly`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly)               | WebAssembly へのアクセス                                                                                                                                                                             |

## Next.js Specific Polyfills

- [AsyncLocalStorage](https://nodejs.org/api/async_context.html#class-asynclocalstorage)

## 環境変数

`process.env`を使えば、`next dev`と`next build`両方から[環境変数](/docs/app-router/building-your-application/configuring/environment-variables)にアクセスできます。

## サポートしていない API

Edge ランタイムには、以下のような制限があります：

- Node.js のネイティブ API はサポートされていません。例えば、ファイルシステムへの読み書きはできません
- ES モジュールを実装し、ネイティブ Node.js API を使用しない限り、`node_modules`を使用できます
- `require`を直接呼び出すことはできません。代わりに ES モジュールを使用してください

また以下の JavaScript の言語機能は無効になっており、動作しません：

| API                                                                                                                                   | 説明                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`eval`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)                                       | 文字列として表現された JavaScript コードを評価する                            |
| [`new Function(evalString)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)               | 引数として与えられたコードで新しい関数を作成する                              |
| [`WebAssembly.compile`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/compile)         | バッファ・ソースから WebAssembly モジュールをコンパイルする                   |
| [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate) | バッファ・ソースから WebAssembly モジュールをコンパイルし、インスタンス化する |

まれに、*実行時に到達できない*動的なコード評価文がコードに含まれている（またはインポートされている）場合があり、そのようなステートメントはツリーシェイキングでは削除できません。このチェックを緩和して、Middleware または Edge API Route にエクスポートされた設定で特定のファイルを許可できます：

```ts
export const config = {
  runtime: 'edge', // Edge API Routesのための指定
  unstable_allowDynamic: [
    // 単一のファイルを許可する
    '/lib/utilities.js',
    // 3rdパーティのfunction-bindモジュール内のすベてをglobで許可する
    '/node_modules/function-bind/**',
  ],
}
```

`unstable_allowDynamic`は、特定のファイルの動的コード評価を無視する[glob](https://github.com/micromatch/micromatch#matching-features)（または glob の配列）です。glob は、アプリケーションのルート・フォルダからの相対パスで指定します。

これらの文が Edge で実行されると、実行時エラーが発生することに注意してください。
