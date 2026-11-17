import { render } from './mini-react/render'

const todos = [
  { id: 1, text: '牛乳を買う', done: true },
  { id: 2, text: '本を返す', done: false },
  { id: 3, text: '部屋を片付ける', done: false },
]

const app = (
  <div className="todo-app">
    <h1>Todo</h1>
    <input placeholder="やること" />
    <button>追加</button>
    <ul>
      {todos.map((todo) => (
        <li>
          <button>{todo.done ? '✓' : '○'}</button>
          <span
            style={{ textDecoration: todo.done ? 'line-through' : 'none' }}
          >
            {todo.text}
          </span>
          <button>削除</button>
        </li>
      ))}
    </ul>
  </div>
)

render(app, document.getElementById('root')!)
