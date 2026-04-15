import type { TodoItem } from "../types/todo";

interface Props {
  item: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ item, onToggle, onDelete }: Props) {
  return (
    <article className={item.completed ? "completed" : undefined}>
      <span>{item.title}</span>
      {item.description !== null && item.description !== undefined && (
        <span data-testid="todo-description">{item.description}</span>
      )}
      <button aria-label="Toggle" onClick={() => onToggle(item.id)}>
        Toggle
      </button>
      <button aria-label="Delete" data-action="delete" onClick={() => onDelete(item.id)}>
        Delete
      </button>
    </article>
  );
}
