---
title: アクセシビリティ
description: Next.js に組み込まれたアクセシビリティ機能
---

Next.js チームは、すべての開発者（およびそのエンドユーザー）が Next.js にアクセスできるようにすることをお約束します。
Next.js にアクセシビリティ機能をデフォルトで追加することで、すべての人にとって Web がよりインクルーシブになることを目指しています。

## ルートアナウンスメント

サーバー上でレンダリングされたページ間を遷移する場合（`<a href>` タグを使用するなど）、スクリーンリーダーやその他の支援技術は、ページがロードされたときにページタイトルをアナウンスし、ページが変更されたことをユーザーが理解できるようにします。

従来のページ移動に加えて、Next.js はパフォーマンスを向上させるためにクライアント側の遷移もサポートしています（`next/link` を使用）。
クライアント側の遷移が支援技術にも通知されるように、Next.js にはデフォルトでルートアナウンサーが含まれています。

Next.js のルートアナウンサーは、最初に `document.title`、次に `<h1>` 要素、最後に URL パス名を検査して、アナウンスするページ名を探します。
もっともアクセスしやすいユーザーエクスペリエンスのために、アプリケーションの各ページがユニークで説明的なタイトルを持つようにしましょう。

## リンティング

Next.js は、Next.js 用のカスタムルールを含め、[統合された ESLint エクスペリエンス](/docs/app-router/building-your-application/configuring/eslint)をすぐに提供します。
デフォルトでは、Next.js には `eslint-plugin-jsx-a11y` が含まれており、以下の警告を含むアクセシビリティの問題の早期発見を支援します:

- [aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [aria-proptypes](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-proptypes.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [aria-unsupported-elements](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-unsupported-elements.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [role-has-required-aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/role-has-required-aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [role-supports-aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/role-supports-aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)

例えば、このプラグインは `img` タグに alt テキストを追加する、正しい `aria-*` 属性を使用する、正しい `role` 属性を使用するなどを確実にするのに役立ちます。

## アクセシビリティリソース

- [WebAIM WCAG チェックリスト](https://webaim.org/standards/wcag/checklist)
- [WCAG 2.2 ガイドライン](https://www.w3.org/TR/WCAG22/)
- [The A11y プロジェクト](https://www.a11yproject.com/)
- 前景と背景の要素の色の [コントラスト比](https://developer.mozilla.org/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast) をチェックします
- アニメーションを扱うときは [`prefers-reduced-motion`](https://web.dev/prefers-reduced-motion/) を使います
