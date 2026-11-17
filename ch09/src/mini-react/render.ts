import { reconcile } from './reconciler'
import type { Instance } from './reconciler'
import type { MiniElement } from './element'

export interface Root {
  render(element: MiniElement): void
}

// 描画の置き場と、前回描いたツリーの Instance。ミニ版のルートは1つだけ
let rootContainer: Node | null = null
let rootInstance: Instance | null = null
// #@@range_begin(root_element)
// 最後に render に渡した要素。set 関数から描き直すときに使う
let rootElement: MiniElement | null = null
// #@@range_end(root_element)

export function createRoot(container: Node): Root {
  rootContainer = container
  rootInstance = null
  return {
    // #@@range_begin(root_render)
    render(element: MiniElement) {
      rootElement = element
      rerender()
    },
    // #@@range_end(root_render)
  }
}

// #@@range_begin(rerender)
// 最後に render に渡した要素を、前回の Instance ともう一度照合する
export function rerender(): void {
  if (rootContainer == null || rootElement == null) return
  rootInstance = reconcile(rootContainer, rootInstance, rootElement)
}
// #@@range_end(rerender)
