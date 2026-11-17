import { createElement } from './mini-react/element'
import { applyProps, createDom } from './mini-react/dom'

const style = { width: '120px', height: '40px', border: '3px solid black' }
const onFirst = () => console.log('1つ目のハンドラ')
const onSecond = () => console.log('2つ目のハンドラ')

const button = createElement('button', {
  id: 'add',
  className: 'todo-button',
  style,
  onClick: onFirst,
})
const dom = createDom(button)
document.getElementById('root')!.appendChild(dom)
console.log((dom as Element).outerHTML)

// 2回目の props。id を変え、className を外し、ハンドラを差し替える
applyProps(dom, button.props, {
  id: 'save',
  style,
  onClick: onSecond,
  children: [],
})
console.log((dom as Element).outerHTML)
