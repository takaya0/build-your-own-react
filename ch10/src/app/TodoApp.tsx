// #@@range_begin(import_hooks)
import { useEffect } from '../mini-react/hooks/useEffect'
import { useRef } from '../mini-react/hooks/useRef'
import { useState } from '../mini-react/hooks/useState'
// #@@range_end(import_hooks)

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

// #@@range_begin(todo_app)
function loadTodos(): Todo[] {
  try {
    const stored = JSON.parse(localStorage.getItem('todos') ?? '[]')
    return Array.isArray(stored) ? stored : []
  } catch {
    return []
  }
}

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos)
  const [saved, setSaved] = useState(false)
  const nextId = useRef(Math.max(0, ...todos.map((t) => t.id)) + 1)

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos))
    } catch {
      // 保存できなくてもアプリは動かし続ける
    }
  }, [todos])

  const update = (next: Todo[]) => {
    setTodos(next)
    setSaved(true)
  }
  const add = (text: string) => {
    update([...todos, { id: nextId.current, text, done: false }])
    nextId.current += 1
  }
  const toggle = (id: number) => {
    update(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }
  const remove = (id: number) => {
    update(todos.filter((t) => t.id !== id))
  }

  return (
    <div className="todo-app">
      <h1>Todo</h1>
      <TodoForm onAdd={add} />
      <TodoList todos={todos} onToggle={toggle} onRemove={remove} />
      {saved && <SavedNote todos={todos} setSaved={setSaved} />}
    </div>
  )
}
// #@@range_end(todo_app)

// #@@range_begin(saved_note)
type SavedProps = {
  todos: Todo[]
  setSaved: (saved: boolean) => void
}

function SavedNote(props: SavedProps) {
  const { setSaved } = props

  useEffect(() => {
    const timer = setTimeout(() => setSaved(false), 2000)
    return () => clearTimeout(timer)
  }, [props.todos, setSaved])

  return (
    <p>
      保存しました
      <button onClick={() => setSaved(false)}>閉じる</button>
    </p>
  )
}
// #@@range_end(saved_note)
