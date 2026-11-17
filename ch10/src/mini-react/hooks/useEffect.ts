// #@@range_begin(import_instance)
import type { Instance } from '../reconciler'
// #@@range_end(import_instance)
// #@@range_begin(effect_hook)
import { nextSlot } from './current'

type Cleanup = () => void
type EffectSetup = () => Cleanup | void

// useEffect のスロット。前回の依存配列と、setup が返した cleanup
type EffectHook = { deps: unknown[] | undefined; cleanup: Cleanup | void }

// レンダー中に予約し、DOM に反映してから呼ぶ setup の列
let pendingEffects: { hook: EffectHook; setup: EffectSetup }[] = []
// #@@range_end(effect_hook)

// #@@range_begin(deps_changed)
// 依存配列が前回から変わったかを返す。省略したときは毎回「変わった」とする
function depsChanged(
  prev: unknown[] | undefined,
  next: unknown[] | undefined,
): boolean {
  if (prev === undefined || next === undefined) return true
  if (prev.length !== next.length) return true
  for (let i = 0; i < next.length; i++) {
    if (!Object.is(prev[i], next[i])) return true
  }
  return false
}
// #@@range_end(deps_changed)

// #@@range_begin(use_effect)
export function useEffect(setup: EffectSetup, deps?: unknown[]): void {
  const [hooks, i] = nextSlot<EffectHook>('useEffect')
  const prev = hooks[i]
  // 2回目からは、依存配列が変わっていなければ何もしない
  if (prev !== undefined && !depsChanged(prev.deps, deps)) return
  // 最初のレンダーか、依存配列が変わった → 予約する。
  // 前回の cleanup は setup の直前に呼ぶので、新しいスロットに引き継ぐ
  const hook: EffectHook = { deps, cleanup: prev?.cleanup }
  hooks[i] = hook
  pendingEffects.push({ hook, setup })
}
// #@@range_end(use_effect)

// #@@range_begin(flush_effects)
// DOM に反映したあとで呼ぶ。予約した effect の cleanup と setup を順に呼ぶ
export function flushEffects(): void {
  const effects = pendingEffects
  pendingEffects = [] // 呼んでいる途中の予約と混ざらないよう、先に空にする
  for (const { hook, setup } of effects) {
    if (typeof hook.cleanup === 'function') hook.cleanup()
    hook.cleanup = setup()
  }
}
// #@@range_end(flush_effects)

// #@@range_begin(reset_effects)
// 前回の照合が例外で止まり、呼ばれずに残った予約を捨てる
export function resetPendingEffects(): void {
  // 次のレンダーで、依存配列が変わったとみなさせる
  for (const { hook } of pendingEffects) hook.deps = undefined
  pendingEffects = []
}
// #@@range_end(reset_effects)

// #@@range_begin(unmount_effects)
// 消える Instance と、その子孫の effect の cleanup をすべて呼ぶ
export function unmountEffects(instance: Instance): void {
  for (const hook of instance.hooks ?? []) {
    const cleanup = (hook as EffectHook).cleanup
    if (typeof cleanup === 'function') cleanup()
  }
  for (const child of instance.childInstances) unmountEffects(child)
}
// #@@range_end(unmount_effects)
