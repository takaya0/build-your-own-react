import type { Instance } from '../reconciler'

// レンダー中のコンポーネントの Instance と、その中で何番目の hook かを表す
let currentInstance: Instance | null = null
let hookIndex = 0

// コンポーネントの関数を呼ぶ直前に呼ぶ
export function prepareToRender(instance: Instance): void {
  currentInstance = instance
  hookIndex = 0
}

// コンポーネントの関数を呼び終えたら呼ぶ
export function finishRender(): void {
  currentInstance = null
}

// hook が自分のスロットを取る。スロットの配列と、自分の番号を返す
export function nextSlot<T>(hookName: string): [T[], number] {
  if (currentInstance?.hooks == null) {
    throw new Error(`${hookName} はレンダー中にだけ呼べます`)
  }
  return [currentInstance.hooks as T[], hookIndex++]
}
