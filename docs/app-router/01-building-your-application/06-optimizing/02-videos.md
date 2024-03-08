---
title: 動画の最適化
sidebar_label: 動画
description: Next.js アプリケーションでの動画を最適化するための推奨事項とベストプラクティス。
---

このページは、Next.js アプリケーションで動画を使用する方法を説明し、パフォーマンスに影響を与えることなく動画ファイルを保存して表示する方法を示します。

## `<video>` と `<iframe>` の使用

HTML の **`<video>`** タグを使用して直接動画ファイルを埋め込むか、**`<iframe>`** を使用して外部プラットフォームでホストされている動画を埋め込むことができます。

### `<video>`

HTML の [`<video>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/video) タグは、セルフホスティングされた動画コンテンツを埋め込むことができ、再生と外観を完全にコントロールできます。

```jsx title="app/ui/video.jsx"
export function Video() {
  return (
    <video width="320" height="240" controls preload="none">
      <source src="/path/to/video.mp4" type="video/mp4" />
      <track
        src="/path/to/captions.vtt"
        kind="subtitles"
        srcLang="en"
        label="English"
      />
      お使いのブラウザは video タグをサポートしていません。
    </video>
  )
}
```

### `<video>` タグの一般的な属性

| 属性          | 説明                                                                                                                   | 例                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| `src`         | 動画ファイルのソースを指定します。                                                                                     | `<video src="/path/to/video.mp4" />` |
| `width`       | 動画プレーヤーの幅を設定します。                                                                                       | `<video width="320" />`              |
| `height`      | 動画プレーヤーの高さを設定します。                                                                                     | `<video height="240" />`             |
| `controls`    | 指定した場合、デフォルトの再生コントロールセットを表示します。                                                         | `<video controls />`                 |
| `autoplay`    | ページが読み込まれたときに動画の自動再生を開始します。ブラウザによって自動再生ポリシーが異なることに注意してください。 | `<video autoplay />`                 |
| `loop`        | 動画再生をループします。                                                                                               | `<video loop />`                     |
| `muted`       | 初期値としてオーディオをミュートにします。 `autoplay` と一緒によく使用されます。                                       | `<video muted />`                    |
| `preload`     | 動画がどのようにプリロードされるかを指定します。値: `none`, `metadata`, `auto`。                                       | `<video preload="none" />`           |
| `playsInline` | iOS デバイス上でインライン再生を有効にします。iOS Safari での自動再生を機能させるために必要になることがあります。      | `<video playsInline />`              |

> **Good to know:** `autoplay` 属性を使用する場合は、動画がほとんどのブラウザで自動的に再生されるため `muted` 属性も含めることが重要です。また、iOS デバイスとの互換性のために `playsInline` 属性も重要です。

動画の属性の包括的なリストについては、[MDN のドキュメント](https://developer.mozilla.org/ja/docs/Web/HTML/Element/video#attributes)を参照してください。

### 動画のベストプラクティス

- **フォールバックコンテンツ:** `<video>` タグを使用する場合、動画再生をサポートしていないブラウザ向けにタグ内でフォールバックコンテンツを含めてください。
- **字幕やキャプション:** 耳が不自由なユーザーや聞こえにくいユーザーのために字幕やキャプションを含めてください。字幕ファイルソースを指定するために、`<video>` 要素と共に [`<track>`](https://developer.mozilla.org/ja/docs/Web/HTML/Element/track) タグを使用してください。
- **アクセシブルなコントロール:** キーボードナビゲーションとスクリーンリーダーの互換性のために、標準の HTML5 動画コントロールを推奨します。高度なニーズに対しては、アクセシブルなコントロールと一貫したブラウザ体験を提供する [react-player](https://github.com/cookpete/react-player) や [video.js](https://videojs.com/) などのサードパーティ製プレーヤーの利用を検討してください。

### `<iframe>`

HTML `<iframe>` タグを使用して、YouTube や Vimeo などの外部プラットフォームから動画を埋め込むことができます。

```jsx title="app/page.jsx"
export default function Page() {
  return (
    <iframe
      src="https://www.youtube.com/watch?v=gfU1iZnjRZM"
      frameborder="0"
      allowfullscreen
    />
  )
}
```

### `<iframe>` タグの一般的な属性

| 属性              | 説明                                                                 | 例                                     |
| ----------------- | -------------------------------------------------------------------- | -------------------------------------- |
| `src`             | 埋め込むページの URL を指定します。                                  | `<iframe src="https://example.com" />` |
| `width`           | iframe の幅を設定します。                                            | `<iframe width="500" />`               |
| `height`          | iframe の高さを設定します。                                          | `<iframe height="300" />`              |
| `frameborder`     | iframe の周りに境界線を表示するかどうかを指定します。                | `<iframe frameborder="0" />`           |
| `allowfullscreen` | iframe のコンテンツが全画面モードで表示されることを許可します。      | `<iframe allowfullscreen />`           |
| `sandbox`         | iframe 内のコンテンツに対して追加の制限セットを有効にします。        | `<iframe sandbox />`                   |
| `loading`         | 読み込み動作を最適化します（例: 遅延読み込み）。                     | `<iframe loading="lazy" />`            |
| `title`           | アクセシビリティをサポートするために iframe にタイトルを提供します。 | `<iframe title="Description" />`       |

iframe の属性の包括的なリストについては、[MDN のドキュメント](https://developer.mozilla.org/ja/docs/Web/HTML/Element/iframe#attributes)を参照してください。

### 動画埋め込み方法の選択

Next.js アプリケーションで動画を埋め込む方法は 2 つあります:

<!-- textlint-disable -->

- **セルフホスティングされた動画ファイルまたは直接動画ファイルを使用する:** プレイヤーの機能と外観を詳細にコントロールする必要があるシナリオで、`<video>` タグを使用してセルフホスティングした動画を埋め込む場合。この統合方法は、Next.js 内で動画コンテンツのカスタマイズとコントロールが可能です。
  <!-- textlint-enable -->
  <!-- textlint-disable -->
- **動画ホスティングサービス使用を使用する（YouTube、Vimeo など）:** YouTube や Vimeo などの動画ホスティングサービスの場合、`<iframe>` タグを使用して iframe ベースのプレイヤーを埋め込みます。この方法ではプレイヤーのコントロールがいくつか制限されますが、これらのプラットフォームが提供する利便性と機能を利用できます。
<!-- textlint-enable -->

アプリケーションの要件とユーザー・エクスペリエンスに合わせて、埋め込み方法を選択してください。

### 外部でホストされている動画の埋め込み

Next.js を使用して外部プラットフォームから動画情報を取得し、React Suspense を使用して読み込み中のフォールバック状態を処理できます。

**1. 動画埋め込みのための Server Components を作成**

最初のステップは、動画の埋め込みのための iframe を生成する [Server Components](/docs/app-router/building-your-application/rendering/server-components) を作成することです。このコンポーネントは動画のソース URL を取得して iframe をレンダリングします。

```jsx title="app/ui/video-component.jsx"
export default async function VideoComponent() {
  const src = await getVideoSrc()

  return <iframe src={src} frameborder="0" allowfullscreen />
}
```

**2. React Suspense を使用して動画コンポーネントをストリーミング**

動画の埋め込みのための Server Components を作成した後、次のステップは [React Suspense](https://ja.react.dev/reference/react/Suspense) を使用してコンポーネントを[ストリーミング](/docs/app-router/building-your-application/routing/loading-ui-and-streaming)することです。

```jsx title="app/page.jsx"
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<p>動画をローディング中...</p>}>
        <VideoComponent />
      </Suspense>
      {/* その他のページのコンテンツ */}
    </section>
  )
}
```

> **Good to know:** 外部プラットフォームから動画を埋め込む場合、以下のベストプラクティスに従ってください:
>
> - 動画の埋め込みがレスポンシブであることを確認してください。さまざまな画面サイズに iframe または動画プレイヤーを適応させるために CSS を使用します。
> - 特にデータプランが限定されているユーザーのために、ネットワーク条件に基づいて[動画を読み込む戦略](https://yoast.com/site-speed-tips-for-faster-video/)を実装してください。

これにより、ページがブロックされず、ユーザーは動画コンポーネントがストリーミングされている間にページと対話できるため、より良いユーザー・エクスペリエンスを提供できます。

より魅力的で有益なローディングエクスペリエンスを実現するために、フォールバック UI としてローディングスケルトンを使用することを検討してください。シンプルなローディングメッセージを表示する代わりに、このように動画プレイヤーに似たスケルトンを表示します:

```jsx title="app/page.jsx"
import { Suspense } from 'react'
import VideoComponent from '../ui/VideoComponent.jsx'
import VideoSkeleton from '../ui/VideoSkeleton.jsx'

export default function Page() {
  return (
    <section>
      <Suspense fallback={<VideoSkeleton />}>
        <VideoComponent />
      </Suspense>
      {/* その他のページのコンテンツ */}
    </section>
  )
}
```

## セルフホスティング動画

セルフホスティング動画は、いくつかの理由で好ましい場合があります:

- **完全なコントロールと独立性:** セルフホスティングでは、外部プラットフォームの制約に制限されず、完全な所有権とコントロールを確保しながら、再生から見た目まで動画コンテンツを直接管理ができます。
- **特定のニーズに合わせたカスタマイズ::** 動的な背景動画など、独自の要件に最適で、デザインと機能のニーズに合わせたカスタマイズが可能です。
- **パフォーマンスとスケーラビリティの考慮::** トラフィックとコンテンツサイズの増加を効果的にサポートする、高性能かつスケーラブルなストレージソリューションを選択できます。
- **コストと統合::** ストレージや帯域幅のコストと、Next.js フレームワークやより広範な技術エコシステムへの統合の必要性とのバランスを取れます。

### Vercel Blob を使用した動画ホスティング

[Vercel Blob](https://vercel.com/docs/storage/vercel-blob) は、Next.js ともうまく連携するスケーラブルなクラウドストレージソリューションを提供し、動画をホストする効率的な方法を提供します。Vercel Blob を使用して動画をホストする方法は以下のとおりです:

**1. Vercel Blob への動画のアップロード**

Vercel ダッシュボードで "Storage" タブを選択し、[Vercel Blob](https://vercel.com/docs/storage/vercel-blob) ストアを選択します。Blob テーブルの右上隅にある "Upload" ボタンをクリックし、アップロードしたい動画ファイルを選択します。アップロードが完了すると、動画ファイルが Blob テーブルに表示されます。

代わりに、Server Actions を使用して動画をアップロードできます。詳細な手順については、Vercel のドキュメントの[サーバーサイドでのアップロード](https://vercel.com/docs/storage/vercel-blob/server-upload)を参照してください。Vercel は[クライアントサイドでのアップロード](https://vercel.com/docs/storage/vercel-blob/client-upload)もサポートしています。この方法は、特定のユースケースに適している場合があります。

**2. Next.js での動画の表示**

動画がアップロードされて保存されたら、Next.js アプリケーションでそれを表示できます。以下は、`<video>` タグと React Suspense を使用して行う例です:

```jsx title="app/page.jsx"
import { Suspense } from 'react'
import { list } from '@vercel/blob'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading video...</p>}>
      <VideoComponent fileName="my-video.mp4" />
    </Suspense>
  )
}

async function VideoComponent({ fileName }) {
  const { blobs } = await list({
    prefix: fileName,
    limit: 1,
  })
  const { url } = blobs[0]

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      お使いのブラウザは video タグをサポートしていません。
    </video>
  )
}
```

このアプローチでは、ページは動画の `@vercel/blob` URL を使用して `VideoComponent` を介して動画を表示します。動画 URL が取得され、動画の表示の準備ができるまで React Suspense を使用してフォールバックを表示します。

### 動画に字幕を追加する

動画に字幕がある場合、`<video>` タグ内の `<track>` 要素を使用して簡単に追加できます。動画ファイルと同様に、字幕ファイルを [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) から取得できます。以下は、字幕を含めるために `<VideoComponent>` を更新する方法です。

```jsx title="app/page.jsx"
async function VideoComponent({ fileName }) {
  const {blobs} = await list({
    prefix: fileName,
    limit: 2
  });
  const { url } = blobs[0];
  const { url: captionsUrl } = blobs[1];

  return (
    <video controls preload="none" aria-label="Video player">
      <source src={url} type="video/mp4" />
      <track
        src={captionsUrl}
        kind="subtitles"
        srcLang="en"
        label="English">
      Your browser does not support the video tag.
    </video>
  );
};
```

このアプローチを使用することで、効果的にセルフホスティングされた動画を Next.js アプリケーションに統合できます。

## リソース

動画の最適化とベストプラクティスについてさらに学ぶには、次のリソースを参照してください:

- **動画フォーマットとコーデックの理解:** MP4 などの互換性のあるフォーマットや WebM などの Web 最適化のためのフォーマットとコーデックを選びましょう。詳細については、[Mozilla の動画コーデックに関するガイド](https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs)を参照してください。
- **動画圧縮:** FFmpeg などのツールを使用して動画を効率的に圧縮し、品質とファイルサイズのバランスをとります。圧縮技術については、[FFmpeg の公式ウェブサイト](https://www.ffmpeg.org/)で学べます。
- **解像度とビットレートの調整:** 視聴プラットフォームに基づいて [解像度とビットレート](https://www.dacast.com/blog/bitrate-vs-resolution/#:~:text=The%20two%20measure%20different%20aspects,yield%20different%20qualities%20of%20video) を調整します。モバイルデバイスなど低設定が望ましい場合もあります。
- **Content Delivery Networks (CDNs):** CDN を使用して動画配信速度を向上させ、高いトラフィックを管理します。Vercel Blob などの一部のストレージソリューションを使用する場合、CDN 機能は自動的に処理されます。詳細は[CDN とその利点](https://vercel.com/docs/edge-network/overview)を参照してください。

Next.js プロジェクトに動画を統合するための以下の動画ストリーミングプラットフォームを検討できます:

### オープンソースの `next-video` コンポーネント

- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob)、S3、Backblaze、および Mux など、さまざまなホスティングサービスと互換性のある Next.js のための `<Video>` コンポーネントを提供します。
- 異なるホスティングサービスで `next-video.dev` を使用するためには[詳細なドキュメント](https://next-video.dev/docs)を参照してください。

### Cloudinary インテグレーション

- Next.js で Cloudinary を使用するための[公式ドキュメントと統合ガイド](https://next.cloudinary.dev/)を参照してください。
- [ドロップイン動画サポート](https://next.cloudinary.dev/cldvideoplayer/basic-usage)のための `<CldVideoPlayer>` コンポーネントが含まれます。
- [アダプティブ・ビットレート・ストリーミング](https://github.com/cloudinary-community/cloudinary-examples/tree/main/examples/nextjs-cldvideoplayer-abr)を含む、Next.js と Cloudinary を統合する[例](https://github.com/cloudinary-community/cloudinary-examples/?tab=readme-ov-file#nextjs)があります。
- Node.js SDK を含む他の [Cloudinary ライブラリ](https://cloudinary.com/documentation)も利用可能です。

### Mux Video API

- Mux と Next.js で動画コースを作成するための [スターターテンプレート](https://github.com/muxinc/video-course-starter-kit)が Mux によって提供されています。
- [Next.js アプリケーション向けの高性能動画](https://www.mux.com/for/nextjs)の埋め込みに関する Mux の推奨事項を参照してください。
- Mux と Next.js をデモンストレーションする[例](https://with-mux-video.vercel.app/)を参照してください。

### Fastly

- Next.js に Fastly の[オンデマンド動画](https://www.fastly.com/products/streaming-media/video-on-demand)およびストリーミングメディアソリューションを統合する方法について参照してください。
