import { Fragment, jsx } from './jsx-runtime'
import type { MiniElement } from './element'

export { Fragment }

// 開発用の変換が呼ぶ関数。4つ目以降の引数（開発用の情報）は使わない
export function jsxDEV(
  type: MiniElement['type'],
  props: Record<string, any>,
  key?: string | number,
): MiniElement {
  return jsx(type, props, key)
}
