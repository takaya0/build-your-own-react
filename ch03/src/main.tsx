import { createElement } from './mini-react/element'

const todos = [
  { id: 1, text: '牛乳を買う', done: true },
  { id: 2, text: '本を返す', done: false },
  { id: 3, text: '部屋を片付ける', done: false },
]

const items = todos.map((todo) =>
  createElement(
    'li',
    null,
    createElement('button', null, todo.done ? '✓' : '○'),
    createElement(
      'span',
      { style: { textDecoration: todo.done ? 'line-through' : 'none' } },
      todo.text,
    ),
    createElement('button', null, '削除'),
  ),
)

const list = createElement('ul', null, items)

const app = createElement(
  'div',
  { className: 'todo-app' },
  createElement('h1', null, 'Todo'),
  createElement('input', { placeholder: 'やること' }),
  createElement('button', null, '追加'),
  list,
)

console.log(app)
console.log(list.props.children.length)
