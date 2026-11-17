import { rerender } from '../render'
import { nextSlot } from './current'

// set 関数には、新しい値か、今の値から新しい値を作る関数を渡す
export type SetState<S> = (next: S | ((prev: S) => S)) => void

// 1つの useState が使うスロット。今の値と set 関数を覚える
type StateHook<S> = { state: S; setState: SetState<S> }

export function useState<S>(initial: S | (() => S)): [S, SetState<S>] {
  const [hooks, i] = nextSlot<StateHook<S>>('useState')
  if (hooks[i] === undefined) {
    // 最初のレンダー: スロットを作る。set 関数もここで1回だけ作る
    const setState: SetState<S> = (next) => {
      const prev = hooks[i].state
      const value =
        typeof next === 'function' ? (next as (prev: S) => S)(prev) : next
      if (Object.is(value, prev)) return // 同じ値なら何もしない
      hooks[i].state = value
      rerender()
    }
    const state =
      typeof initial === 'function' ? (initial as () => S)() : initial
    hooks[i] = { state, setState }
  }
  return [hooks[i].state, hooks[i].setState]
}
