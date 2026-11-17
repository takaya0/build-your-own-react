import { createElement, Fragment } from './element'
import type { MiniElement, MiniNode } from './element'

// <>...</> の変換先。コンパイラはここから Fragment を import する
export { Fragment }

// props.children を createElement の可変長引数に渡せる配列にする
//   undefined → []、配列 → そのまま、それ以外の1つの値 → [値]
function normalizeJsxChildren(
  children: unknown,
): (MiniNode | MiniNode[])[] {
  if (children === undefined) return []
  const list = Array.isArray(children) ? children : [children]
  return list as (MiniNode | MiniNode[])[]
}

// <li>牛乳を買う</li> → jsx('li', { children: '牛乳を買う' })
export function jsx(
  type: MiniElement['type'],
  props: Record<string, any>,
  key?: string | number,
): MiniElement {
  const { children, ...rest } = props
  return createElement(
    type,
    key === undefined ? rest : { ...rest, key },
    ...normalizeJsxChildren(children),
  )
}

// 子を複数並べて書いたときに呼ばれる。ミニ版は jsx と同じ処理でよい
export const jsxs = jsx

// TypeScript は jsxImportSource の jsx-runtime からこの型を探す
export namespace JSX {
  // TSX の式（<div /> など）の型
  export type Element = MiniElement
  // 書けるタグ名と、その props の型。ミニ版はどのタグも何でも通す
  export interface IntrinsicElements {
    [tagName: string]: any
  }
  // 子を受け取る props の名前
  export interface ElementChildrenAttribute {
    children: {}
  }
  // コンポーネントにも書ける属性。props の型に書かなくても通す
  export interface IntrinsicAttributes {
    key?: string | number
  }
}
