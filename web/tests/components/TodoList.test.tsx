import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoList } from "../../src/components/TodoList";
import type { TodoItem } from "../../src/types/todo";

const items: TodoItem[] = [
  {
    id: "1",
    title: "First task",
    description: null,
    completed: false,
    created_at: "2026-04-14T12:00:00.000Z",
  },
  {
    id: "2",
    title: "Second task",
    description: "Details",
    completed: true,
    created_at: "2026-04-14T12:01:00.000Z",
  },
];

describe("TodoList component — US1", () => {
  it("renders all provided items", () => {
    render(<TodoList items={items} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("First task")).toBeInTheDocument();
    expect(screen.getByText("Second task")).toBeInTheDocument();
  });

  it("renders correct number of list items", () => {
    render(<TodoList items={items} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getAllByRole("article")).toHaveLength(2);
  });

  it("shows empty-state message when items array is empty", () => {
    render(<TodoList items={[]} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no to-dos/i)).toBeInTheDocument();
  });
});
