import "./TodoItem.css";
import type { TodoItem } from "../types/todo";

interface Props {
  item: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ item, onToggle, onDelete }: Props) {
  return (
    <tr data-testid="todo-row" className={item.completed ? "todo-row completed" : "todo-row"}>
      <td className="col-status">
        {item.completed ? "✅" : "⬜"}
      </td>
      <td className="col-content">
        <span className="todo-title">{item.title}</span>
        {item.description !== null && item.description !== undefined && (
          <span data-testid="todo-description" className="todo-desc">{item.description}</span>
        )}
      </td>
      <td className="col-actions">
        <button
          aria-label={item.completed ? "Undo" : "Toggle"}
          className="icon-btn"
          onClick={() => onToggle(item.id)}
        >
          {item.completed ? "↩" : "✓"}
        </button>
        <button
          aria-label="Delete"
          className="icon-btn danger"
          onClick={() => onDelete(item.id)}
        >
          🗑
        </button>
      </td>
    </tr>
  );
}
