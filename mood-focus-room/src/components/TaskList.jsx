import { Check, Plus, Trash2 } from "lucide-react";

export function TaskList({ todos, newTodo, progress, onNewTodo, onAdd, onToggle, onDelete, onClearCompleted }) {
  return (
    <section className="mini-card glass task-card">
      <div className="mini-title"><span className="section-icon">✓</span><b>Today's focus</b><span>{progress}% complete</span></div>
      <div className="progress"><i style={{ width: `${progress}%` }} /></div>
      <form onSubmit={onAdd} className="todo-add">
        <input value={newTodo} onChange={(event) => onNewTodo(event.target.value)} placeholder="Add a task..." aria-label="New task" />
        <button aria-label="Add task"><Plus size={18} /></button>
      </form>
      <div className="todos">
        {todos.length === 0 && <p className="empty-tasks">Add one small outcome for this session.</p>}
        {todos.map((todo) => (
          <div className={`todo ${todo.done ? "done" : ""}`} key={todo.id}>
            <button className="check" onClick={() => onToggle(todo.id)} aria-label={`Mark ${todo.text} ${todo.done ? "open" : "complete"}`}>{todo.done && <Check size={13} />}</button>
            <span>{todo.text}</span>
            <button className="delete" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.text}`}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      {todos.some((todo) => todo.done) && <button className="clear-completed" onClick={onClearCompleted}>Clear completed</button>}
    </section>
  );
}
