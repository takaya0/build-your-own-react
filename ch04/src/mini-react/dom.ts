// #@@range_begin(create_dom)
import { TEXT_ELEMENT } from './element'
import type { MiniElement, MiniProps } from './element'

export function createDom(element: MiniElement): Node {
  // テキストの要素は Text ノードにする。属性はないので applyProps は呼ばない
  if (element.type === TEXT_ELEMENT) {
    const text = document.createTextNode('')
    text.nodeValue = element.props.nodeValue
    return text
  }
  // タグ名の要素は要素ノードにする。子にはまだ触れない
  const dom = document.createElement(element.type as string)
  // 初回は前回の props がないので、children だけの空の props を前回とする
  applyProps(dom, { children: [] }, element.props)
  return dom
}
// #@@range_end(create_dom)

// #@@range_begin(prop_keys_fn)
// children / key / ref は属性ではないので、DOM に当てない
function isAttributeKey(key: string): boolean {
  return key !== 'children' && key !== 'key' && key !== 'ref'
}

// 'on' で始まるキーはイベントハンドラ（onClick、onInput など）
function isEventKey(key: string): boolean {
  return key.startsWith('on')
}

// onClick → 'click'。先頭の 'on' を外して小文字にする
function eventName(key: string): string {
  return key.slice(2).toLowerCase()
}
// #@@range_end(prop_keys_fn)

// #@@range_begin(apply_props)
export function applyProps(
  dom: Node,
  prevProps: MiniProps,
  nextProps: MiniProps,
): void {
  // 1. 撤去: 前回のイベントはすべて外す。消えた属性と style のキーを消す
  for (const key of Object.keys(prevProps)) {
    if (!isAttributeKey(key)) continue
    if (isEventKey(key)) {
      dom.removeEventListener(eventName(key), prevProps[key])
      continue
    }
    if (key === 'style' && prevProps[key] && nextProps[key]) {
      const style =
        (dom as HTMLElement).style as unknown as Record<string, string>
      for (const styleKey of Object.keys(prevProps[key])) {
        if (styleKey in nextProps[key]) continue
        style[styleKey] = ''
      }
      continue
    }
    if (key in nextProps) continue
    if (key === 'className') {
      ;(dom as Element).removeAttribute('class')
    } else {
      ;(dom as Element).removeAttribute(key)
    }
  }
  // 2. 適用: 今回の props をすべて当てる
  for (const key of Object.keys(nextProps)) {
    if (!isAttributeKey(key)) continue
    const value = nextProps[key]
    if (isEventKey(key)) {
      dom.addEventListener(eventName(key), value)
    } else if (key === 'style') {
      Object.assign((dom as HTMLElement).style, value)
    } else if (key === 'className') {
      ;(dom as Element).setAttribute('class', value)
    } else {
      ;(dom as Element).setAttribute(key, String(value))
    }
  }
}
// #@@range_end(apply_props)
