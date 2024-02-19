---
title: userAgent
description: userAgent ヘルパーは、リクエストのユーザーエージェントオブジェクトとやりとりするための追加のプロパティとメソッドで Web リクエスト API を拡張します。
---

`userAgent` ヘルパーは、リクエストのユーザーエージェントオブジェクトとやりとりするための追加のプロパティとメソッドで [Web リクエスト API](https://developer.mozilla.org/docs/Web/API/Request) を拡張します。

```ts title="middleware.ts"
import { NextRequest、NextResponse、userAgent } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl
  const { device } = userAgent(request)
  const viewport = device.type === 'mobile' ? 'mobile' : 'desktop'
  url.searchParams.set('viewport'、viewport)
  return NextResponse.rewrite(url)
}
```

## `isBot`

リクエストが既知のボットからのものかどうかを示すブール値です。

## `browser`

リクエストで使用されたブラウザに関する情報を含むオブジェクトです。

- `name`: ブラウザ名を表す文字列で、特定できない場合は`undefined` です。
- `version`: ブラウザのバージョンを表す文字列、または `undefined` です。

## `device`

リクエストで使用されたデバイスに関する情報を含むオブジェクトです。

- `model`: デバイスのモデルを表す文字列、または `undefined` です。
- `type`: `console`、`mobile`、`tablet`、`smarttv`、`wearable`、`embedded` など、デバイスの種類を表す文字列、または `undefined` です。
- `vendor`: デバイスのベンダーを表す文字列、または `undefined` です。

## `engine`

ブラウザのエンジンに関する情報を含むオブジェクトです。

- `name`: エンジン名を表す文字列で、次のような値になることが想定されます: `Amaya`、`Blink`、`EdgeHTML`、`Flow`、`Gecko`、`Goanna`、`iCab`、`KHTML`、`Links`、`Lynx`、`NetFront`、`NetSurf`、`Presto`、`Tasman`、`Trident`、`w3m`、`WebKit`、または `undefined` 。
- `version`: エンジンのバージョンを表す文字列、または `undefined` です。

## `os`

オペレーティングシステムに関する情報を含むオブジェクトです。

- `name`: OS名を表す文字列、または `undefined` です。
- `version`: OSのバージョンを表す文字列、または `undefined` です。

## `cpu`

CPUアーキテクチャに関する情報を含むオブジェクトです。

- `architecture`: CPUのアーキテクチャを表す文字列で、次のような値になることが想定されます: `68k`、`amd64`、`arm`、`arm64`、`armhf`、`avr`、`ia32`、`ia64`、`irix`、`irix64`、`mips`、`mips64`、`pa-risc`、`ppc`、`sparc`、`sparc64`、 または `undefined`。
