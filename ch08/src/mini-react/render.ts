import { reconcile } from './reconciler'
import type { Instance } from './reconciler'
import type { MiniElement } from './element'

export interface Root {
  render(element: MiniElement): void
}

// 描画の置き場と、前回描いたツリーの Instance。ミニ版のルートは1つだけ
let rootContainer: Node | null = null
let rootInstance: Instance | null = null

export function createRoot(container: Node): Root {
  rootContainer = container
  rootInstance = null
  return {
    render(element: MiniElement) {
      if (rootContainer == null) return
      rootInstance = reconcile(rootContainer, rootInstance, element)
    },
  }
}
