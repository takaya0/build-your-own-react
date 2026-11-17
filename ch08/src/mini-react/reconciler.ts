// #@@range_begin(instance)
import { applyProps, createDom } from './dom'
import { TEXT_ELEMENT } from './element'
import type { MiniElement } from './element'

// 描いた要素の記録。再レンダーをまたいで残し、次の照合に使う
export interface Instance {
  dom: Node | null // 対応する DOM ノード。コンポーネントは子のものをもつ
  element: MiniElement // 前回描いた要素。次の照合で「前回」になる
  childInstances: Instance[] // 子の Instance。子どうしの照合に使う
}

// 前回の Instance と今回の要素が、同じ type かを返す
function sameType(oldInstance: Instance, element: MiniElement): boolean {
  return oldInstance.element.type === element.type
}
// #@@range_end(instance)

// #@@range_begin(reconcile)
// 前回の Instance と今回の要素を突き合わせ、今回の Instance を返す
export function reconcile(
  parentDom: Node,
  oldInstance: Instance | null,
  element: MiniElement | null,
): Instance | null {
  // 1. 今回の要素がない → 前回の DOM ノードを外す
  if (element == null) {
    if (oldInstance?.dom) parentDom.removeChild(oldInstance.dom)
    return null
  }
  // 2. コンポーネント → 関数を呼び、返った要素で照合を続ける
  if (typeof element.type === 'function') {
    return reconcileComponent(parentDom, oldInstance, element)
  }
  // 3. 前回がない、または type が違う → DOM ノードを作る。
  //    前回のノードがあればその位置で置き換え、なければ末尾に足す
  if (oldInstance == null || !sameType(oldInstance, element)) {
    const dom = createDom(element)
    const instance: Instance = { dom, element, childInstances: [] }
    reconcileChildren(dom, instance, element)
    if (oldInstance?.dom) parentDom.replaceChild(dom, oldInstance.dom)
    else parentDom.appendChild(dom)
    return instance
  }
  // ここから下は、前回と同じ type。前回の DOM ノードを使い回す
  const dom = oldInstance.dom!
  // 4. テキスト → 文字が変わったときだけ書き換える
  if (element.type === TEXT_ELEMENT) {
    if (oldInstance.element.props.nodeValue !== element.props.nodeValue) {
      dom.nodeValue = String(element.props.nodeValue)
    }
    return { dom, element, childInstances: [] }
  }
  // 5. タグ → props を当て直し、子を照合する
  applyProps(dom, oldInstance.element.props, element.props)
  const instance: Instance = {
    dom,
    element,
    childInstances: oldInstance.childInstances,
  }
  reconcileChildren(dom, instance, element)
  return instance
}
// #@@range_end(reconcile)

// #@@range_begin(reconcile_component)
function reconcileComponent(
  parentDom: Node,
  oldInstance: Instance | null,
  element: MiniElement,
): Instance {
  const type = element.type as Function
  const childElement: MiniElement = type(element.props)
  const isSame = oldInstance != null && sameType(oldInstance, element)
  // 同じコンポーネントなら、前回返した要素の Instance と照合する。
  // 違えば前回とは照合せず、返した要素を新しく描く（末尾に足される）
  const oldChild = isSame ? (oldInstance.childInstances[0] ?? null) : null
  const childInstance = reconcile(parentDom, oldChild, childElement)
  // 前回があれば、新しいノードで前回のノードを置き換える
  if (!isSame && oldInstance?.dom && childInstance?.dom) {
    parentDom.replaceChild(childInstance.dom, oldInstance.dom)
  }
  return {
    dom: childInstance?.dom ?? null, // 自分の DOM はなく、子のものをもつ
    element,
    childInstances: childInstance ? [childInstance] : [],
  }
}
// #@@range_end(reconcile_component)

// #@@range_begin(children_key)
function reconcileChildren(
  dom: Node,
  instance: Instance,
  element: MiniElement,
): void {
  const oldChildren = instance.childInstances
  // key をもつ前回の子を、key から引けるようにしておく
  const oldByKey = new Map<string | number, Instance>()
  for (const old of oldChildren) {
    const key = old.element.props.key
    if (key != null) oldByKey.set(key, old)
  }
  const used = new Set<Instance>()
  const newChildren: Instance[] = []
  element.props.children.forEach((child, i) => {
    // key があれば同じ key の子、なければ同じ位置の子が相手の候補
    const key = child.props.key
    const found = key != null ? oldByKey.get(key) : oldChildren[i]
    // 候補と key が食い違う（片方だけ key をもつ）なら、照合しない
    const old = found && found.element.props.key === key ? found : null
    if (old) used.add(old)
    const childInstance = reconcile(dom, old, child)
    if (childInstance) newChildren.push(childInstance)
  })
  // どの子とも照合しなかった前回の子は、DOM から外す
  for (const old of oldChildren) {
    if (!used.has(old)) reconcile(dom, old, null)
  }
  instance.childInstances = newChildren
}
// #@@range_end(children_key)
