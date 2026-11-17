import { reconcile } from './reconciler'
import type { Instance } from './reconciler'
import type { MiniElement } from './element'
// #@@range_begin(import_flush)
import { flushEffects, resetPendingEffects } from './hooks/useEffect'
// #@@range_end(import_flush)

export interface Root {
  render(element: MiniElement): void
}

// 描画の置き場と、前回描いたツリーの Instance。ミニ版のルートは1つだけ
let rootContainer: Node | null = null
let rootInstance: Instance | null = null
// 最後に render に渡した要素。set 関数から描き直すときに使う
let rootElement: MiniElement | null = null

export function createRoot(container: Node): Root {
  rootContainer = container
  rootInstance = null
  return {
    render(element: MiniElement) {
      rootElement = element
      rerender()
    },
  }
}

// #@@range_begin(rerender_flush)
// 最後に render に渡した要素を、前回の Instance ともう一度照合する
export function rerender(): void {
  if (rootContainer == null || rootElement == null) return
  resetPendingEffects() // 前回の照合が途中で止まったときの予約を捨てる
  rootInstance = reconcile(rootContainer, rootInstance, rootElement)
  flushEffects() // DOM に反映したあとで effect を呼ぶ
}
// #@@range_end(rerender_flush)
