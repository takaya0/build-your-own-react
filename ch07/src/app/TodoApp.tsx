// #@@range_begin(todo_item)
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
// #@@range_end(todo_item)

// #@@range_begin(todo_list)
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
          todo={todo}
          onToggle={props.onToggle}
          onRemove={props.onRemove}
        />
      ))}
    </ul>
  )
}
// #@@range_end(todo_list)

// #@@range_begin(todo_form)
function TodoForm(props: { onAdd: () => void }) {
  return (
    <div>
      <input placeholder="やること" />
      <button onClick={props.onAdd}>追加</button>
    </div>
  )
}
// #@@range_end(todo_form)

// #@@range_begin(todo_app)
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
// #@@range_end(todo_app)
