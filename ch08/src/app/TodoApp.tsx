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

// #@@range_begin(todo_list_key)
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
// #@@range_end(todo_list_key)

function TodoForm(props: { onAdd: () => void }) {
  return (
    <div>
      <input placeholder="やること" />
      <button onClick={props.onAdd}>追加</button>
    </div>
  )
}

export function TodoApp(props: { todos: Todo[] }) {
  // 押されたことを Console に出すだけ。画面を変える仕組みはまだない
  const add = () => console.log('add')
  const toggle = (id: number) => console.log('toggle', id)
  const remove = (id: number) => console.log('remove', id)

  return (
    <div className="todo-app">
      <h1>Todo</h1>
      <TodoForm onAdd={add} />
      <TodoList todos={props.todos} onToggle={toggle} onRemove={remove} />
    </div>
  )
}
