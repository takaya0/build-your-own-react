import { nextSlot } from './current'

// useRef のスロット。current を書き換えても再レンダーは起きない
type RefHook<T> = { current: T }

export function useRef<T>(initial: T): RefHook<T> {
  const [hooks, i] = nextSlot<RefHook<T>>('useRef')
  // 最初のレンダーでだけ箱を作る。2回目からは同じ箱を返す
  if (hooks[i] === undefined) hooks[i] = { current: initial }
  return hooks[i]
}
