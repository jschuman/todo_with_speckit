import { TodoItem as TodoItemComponent } from "./TodoItem";
import type { TodoItem } from "../types/todo";

interface Props {
  items: TodoItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ items, onToggle, onDelete }: Props) {
  if (items.length === 0) {
    return <p>No to-dos found.</p>;
  }
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <TodoItemComponent item={item} onToggle={onToggle} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}
