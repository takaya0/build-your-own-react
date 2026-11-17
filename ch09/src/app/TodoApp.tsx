// #@@range_begin(import_use_state)
import { useState } from '../mini-react/hooks/useState'
// #@@range_end(import_use_state)

type Todo = { id: number; text: string; done: boolean }

type ItemProps = {
  todo: Todo
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

function TodoItem(props: ItemProps) {
  const { todo } = props
  return (
    <li>
      <button onClick={() => props.onToggle(todo.id)}>
        {todo.done ? '✓' : '○'}
      </button>
      <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => props.onRemove(todo.id)}>削除</button>
    </li>
  )
}

type ListProps = {
  todos: Todo[]
  onToggle: (id: number) => void
  onRemove: (id: number) => void
}

function TodoList(props: ListProps) {
  return (
    <ul>
      {props.todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={props.onToggle}
          onRemove={props.onRemove}
        />
      ))}
    </ul>
  )
}

// #@@range_begin(todo_form)
function TodoForm(props: { onAdd: (text: string) => void }) {
  const [draft, setDraft] = useState('')

  const submit = () => {
    const text = draft.trim()
    if (text !== '') props.onAdd(text)
  }

  return (
    <div>
      <input
        placeholder="やること"
        onInput={(e: { currentTarget: HTMLInputElement }) =>
          setDraft(e.currentTarget.value)
        }
      />
      <button onClick={submit}>追加</button>
    </div>
  )
}
// #@@range_end(todo_form)

// #@@range_begin(todo_app)
const initialTodos: Todo[] = [
  { id: 1, text: '牛乳を買う', done: true },
  { id: 2, text: '本を返す', done: false },
  { id: 3, text: '部屋を片付ける', done: false },
]

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [nextId, setNextId] = useState(
    Math.max(0, ...todos.map((t) => t.id)) + 1,
  )

  const add = (text: string) => {
    setTodos([...todos, { id: nextId, text, done: false }])
    setNextId(nextId + 1)
  }
  const toggle = (id: number) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }
  const remove = (id: number) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  return (
    <div className="todo-app">
      <h1>Todo</h1>
      <TodoForm onAdd={add} />
      <TodoList todos={todos} onToggle={toggle} onRemove={remove} />
    </div>
  )
}
// #@@range_end(todo_app)
