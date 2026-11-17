import { createDom } from './dom'
import type { MiniElement } from './element'

// 要素ツリーをたどって実 DOM を作り、container の子として置く
export function render(element: MiniElement, container: Node): void {
  // 0. type が関数（コンポーネント）なら、関数を呼んで返った要素を描く。
  //    自分の DOM ノードは作らず、container もそのまま渡す
  if (typeof element.type === 'function') {
    const child: MiniElement = element.type(element.props)
    render(child, container)
    return
  }
  // 1. この要素1つ分の DOM ノードを作る（子には触れない）
  const dom = createDom(element)
  // 2. 子を順に描く。子の置き場所は、まだどこにもつながっていない dom
  element.props.children.forEach((child) => render(child, dom))
  // 3. 子をすべて抱えた dom を container につなぐ
  container.appendChild(dom)
}
