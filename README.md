# build-your-own-react

技術書典21で頒布する『作って学ぶ React のしくみ ― ミニ React を自作して Todo アプリを動かす』（やたか）のサンプルコードです。

本書では、React のしくみを小さな React（本書では「ミニ版」と呼びます）を自作しながら学びます。
題材は Todo アプリで、第10章を終えると、第1章で動かした Todo アプリと同じ形のアプリがミニ版の上で動きます。

## 章とフォルダの対応

`chNN/` には、本書の各章を読み終えた時点のコードを置いています。
どのフォルダも単独のプロジェクトなので、読みたい章のフォルダだけで動かせます。

| フォルダ | 章 | 中身 |
|---|---|---|
| [`ch01/`](ch01/) | 第1章 Reactを使う側から見る | 完成形の Todo アプリ。このフォルダだけは本物の React（19.3.1）を使う |
| [`ch02/`](ch02/) | 第2章 準備と全体像 | ミニ版を書き始める前のプロジェクト。`src/app/` と `src/mini-react/` は空 |
| [`ch03/`](ch03/) | 第3章 要素オブジェクトを作る | `createElement`（`element.ts`）。固定3件の Todo を要素オブジェクトにする |
| [`ch04/`](ch04/) | 第4章 要素を実DOMにする | `createDom`・`applyProps`（`dom.ts`）。要素1つを実 DOM にする |
| [`ch05/`](ch05/) | 第5章 ツリーを画面に描く | `render`（`render.ts`）。固定3件の Todo が画面に表示される |
| [`ch06/`](ch06/) | 第6章 TSXを自前のランタイムで動かす | `jsx`・`jsxs`（`jsx-runtime.ts`）。同じ画面を TSX で書く |
| [`ch07/`](ch07/) | 第7章 コンポーネントに分ける | 関数コンポーネント（`render.ts`）。ボタンを押しても画面は変わらない |
| [`ch08/`](ch08/) | 第8章 再レンダーと差分照合 | `reconcile`（`reconciler.ts`）、`createRoot`（`render.ts`）。描き直しで DOM が再利用される |
| [`ch09/`](ch09/) | 第9章 useState | `useState`（`hooks/`）。追加・完了・削除が動く |
| [`ch10/`](ch10/) | 第10章 useRefとuseEffect | `useRef`・`useEffect`（`hooks/`）。一覧を localStorage に保存する |

第2〜10章では、ミニ版を `src/mini-react/` に、Todo アプリを `src/app/` と `src/main.tsx` に置いています。

## 動かし方

[bun](https://bun.sh/) を使います。
インストールしていない場合は、bun の公式サイトの手順でインストールしてください。

```sh
git clone https://github.com/takaya0/build-your-own-react.git
cd build-your-own-react/ch01
bun install
bun run dev
```

表示された URL をブラウザで開きます。
ほかの章を動かすときは、`ch01` を読みたい章のフォルダに変えます。
フォルダごとに独立したプロジェクトなので、`bun install` はフォルダごとに実行してください。

`bun run build` を実行すると、型検査（`tsc`）とビルド（`vite build`）を行います。

### 動作確認環境

- bun 1.4.4
- TypeScript 7.0.2
- Vite 8.3.8
- React 19.3.1（`ch01/` のみ）

## 本文のコードとの関係

本文のコードリストは、このリポジトリのファイルから取り込んで組んでいます。
本書（技術書典21版 v1.0.0）と同じコードには、タグ [`v1.0.0`](https://github.com/takaya0/build-your-own-react/tree/v1.0.0) を付けています。
誤りを直したときは `main` を更新します。
本文とこのリポジトリのコードが食い違っていた場合は、このリポジトリの `main` のコードを正としてください。

誤りを見つけたときは、このリポジトリの [Issues](https://github.com/takaya0/build-your-own-react/issues) で知らせてください。

## 範囲マーカー（`// #@@range_begin(…)` の行）

いくつかのファイルには、次のようなコメントの行があります。

```ts
// #@@range_begin(element_types)
// テキストの子を表す擬似 type
export const TEXT_ELEMENT = 'TEXT_ELEMENT' as const
…
// #@@range_end(element_types)
```

これは、ファイルの一部だけを本文に載せるための目印です。
本の組版に使っているツール（Re:VIEW）が、`range_begin` と `range_end` の行で挟まれた部分を本文のコードリストに取り込みます。
括弧の中は、取り込む範囲の名前です。
マーカーの行そのものは本文に載りません。

どの行もただのコメントなので、動作には影響しません。
本文のコードや自分で書いたコードと見比べるときは、この行を無視してください。

第6章の `tsconfig.json` にも同じ形のコメントがあります。
`tsconfig.json` はコメントを書ける形式なので、このままで `tsc` と Vite が読み込めます。

## 画面の見た目（`todo.css`）

本文の画面の図は、最小限の CSS を当てて撮りました。
Todo アプリを表示する `ch01/` と `ch05/`〜`ch10/` には、同じ CSS を `todo.css` として置き、`index.html` から読み込んでいます。
そのため、画面は本文の図と同じ見た目になります。
この CSS は本文では解説していません。

## ライセンス

[MIT](LICENSE)
