import { createRoot } from './mini-react/render'
import { TodoApp } from './app/TodoApp'

createRoot(document.getElementById('root')!).render(<TodoApp />)
