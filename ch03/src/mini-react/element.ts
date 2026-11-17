// #@@range_begin(element_types)
// テキストの子を表す擬似 type
export const TEXT_ELEMENT = 'TEXT_ELEMENT' as const

// 複数の子を、余計な DOM 要素なしでまとめる擬似 type
export const Fragment = Symbol.for('mini.fragment')

// 要素オブジェクト。本物の React 要素を { type, props } の2つに絞った形
export interface MiniElement {
  type: string | Function | symbol // 'div' / 関数コンポーネント / Fragment
  props: MiniProps
}

// 属性と children。children は正規化を通った要素の配列
export interface MiniProps {
  [key: string]: any
  children: MiniElement[]
}

// createElement に渡せる子。boolean / null / undefined は描かれない
export type MiniNode =
  MiniElement | string | number | boolean | null | undefined
// #@@range_end(element_types)

// #@@range_begin(create_text_element)
export function createTextElement(value: string | number): MiniElement {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: value,
      children: [],
    },
  }
}
// #@@range_end(create_text_element)

// #@@range_begin(normalize_children)
function normalizeChildren(
  children: (MiniNode | MiniNode[])[],
): MiniElement[] {
  return children
    .flat(Infinity)
    .filter((c): c is MiniElement | string | number =>
      c != null && typeof c !== 'boolean',
    )
    .map((c) => (typeof c === 'object' ? c : createTextElement(c)))
}
// #@@range_end(normalize_children)

// #@@range_begin(create_element)
export function createElement(
  type: MiniElement['type'],
  props: Record<string, any> | null,
  ...children: (MiniNode | MiniNode[])[]
): MiniElement {
  return {
    type,
    props: {
      ...props,
      children: normalizeChildren(children),
    },
  }
}
// #@@range_end(create_element)
