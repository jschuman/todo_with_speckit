import "./TodoList.css";
import { TodoItem as TodoItemComponent } from "./TodoItem";
import type { TodoItem } from "../types/todo";

interface Props {
  items: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ items, onToggle, onDelete }: Props) {
  if (items.length === 0) {
    return <p className="empty-state">No to-dos found.</p>;
  }
  return (
    <div className="todo-table-wrapper">
      <table className="todo-table">
        <thead>
          <tr>
            <th>Status</th>
            <th>Task</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <TodoItemComponent key={item.id} item={item} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
