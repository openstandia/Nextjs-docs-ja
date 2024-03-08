---
title: optimizePackageImports
description: Next.js 設定オプションの optmizedPackageImports の API リファレンス
sidebar_position: 20
---

パッケージによっては、何百、何千ものモジュールをエクスポートすることができ、開発および生産時にパフォーマンスの問題を引き起こす可能性があります。

`experimental.optimizePackageImports` にパッケージを追加すると、実際に使用しているモジュールのみがロードされ、多数の名前付きエクスポートを含む import 文を書く便利さはそのままになります。

```js title="next.config.js"
module.exports = {
  experimental: {
    optimizePackageImports: ['package-name'],
  },
}
```

以下のライブラリはデフォルトで最適化されています:

- `lucide-react`
- `date-fns`
- `lodash-es`
- `ramda`
- `antd`
- `react-bootstrap`
- `ahooks`
- `@ant-design/icons`
- `@headlessui/react`
- `@headlessui-float/react`
- `@heroicons/react/20/solid`
- `@heroicons/react/24/solid`
- `@heroicons/react/24/outline`
- `@visx/visx`
- `@tremor/react`
- `rxjs`
- `@mui/material`
- `@mui/icons-material`
- `recharts`
- `react-use`
- `@material-ui/core`
- `@material-ui/icons`
- `@tabler/icons-react`
- `mui-core`
- `react-icons/*`
