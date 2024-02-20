---
title: instrumentationHook
description: Next.js アプリに instrumentation を設定するには、instrumentationHook オプションを使用します。
related:
  title: Instrumentation について詳しく学ぶ
  links:
    - app-router/api-reference/file-conventions/instrumentation
    - app-router/building-your-application/optimizing/instrumentation
---

実験的な `instrumentationHook` オプションを使用すると、Next.js アプリの [instrumentation ファイル](/docs/app-router/api-reference/file-conventions/instrumentation)を使用して instrumentation を設定できます。

```js title="next.config.js"
module.exports = {
  experimental: {
    instrumentationHook: true,
  },
}
```

## instrumentation の詳細を学ぶ

- [instrumentation.js](/docs/app-router/api-reference/file-conventions/instrumentation)
- [instrumentation](/docs/app-router/building-your-application/optimizing/instrumentation)
