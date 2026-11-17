import { createRoot } from './mini-react/render'
import { TodoApp } from './app/TodoApp'

let todos = [
  { id: 1, text: '牛乳を買う', done: true },
  { id: 2, text: '本を返す', done: false },
  { id: 3, text: '部屋を片付ける', done: false },
]

const root = createRoot(document.getElementById('root')!)
root.render(<TodoApp todos={todos} />)

// 配列を差し替えて、もう一度 root.render を呼ぶ
function show(next: typeof todos) {
  todos = next
  root.render(<TodoApp todos={todos} />)
}

// Console から呼べるように window に置く（確かめるためだけの関数）
Object.assign(window, {
  toggleTodo: (id: number) =>
    show(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
  removeTodo: (id: number) => show(todos.filter((t) => t.id !== id)),
})
