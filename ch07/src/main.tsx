import { render } from './mini-react/render'
import { TodoApp } from './app/TodoApp'

const todos = [
  { id: 1, text: '牛乳を買う', done: true },
  { id: 2, text: '本を返す', done: false },
  { id: 3, text: '部屋を片付ける', done: false },
]

render(<TodoApp todos={todos} />, document.getElementById('root')!)
