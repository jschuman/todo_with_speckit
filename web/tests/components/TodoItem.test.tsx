import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TodoItem as TodoItemComponent } from "../../src/components/TodoItem";
import type { TodoItem } from "../../src/types/todo";

const activeItem: TodoItem = {
  id: "abc-123",
  title: "Buy milk",
  description: "Whole milk",
  completed: false,
  created_at: "2026-04-14T12:00:00.000Z",
};

const completedItem: TodoItem = { ...activeItem, completed: true };
const noDescItem: TodoItem = { ...activeItem, description: null };

describe("TodoItem component — US1", () => {
  it("renders the title", () => {
    render(
      <TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("renders description when present", () => {
    render(
      <TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByText("Whole milk")).toBeInTheDocument();
  });

  it("does not render description element when null", () => {
    render(
      <TodoItemComponent item={noDescItem} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.queryByTestId("todo-description")).not.toBeInTheDocument();
  });

  it("shows active status for incomplete item", () => {
    render(
      <TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    const article = screen.getByRole("article");
    expect(article).not.toHaveClass("completed");
  });

  it("shows completed status for completed item", () => {
    render(
      <TodoItemComponent item={completedItem} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    const article = screen.getByRole("article");
    expect(article).toHaveClass("completed");
  });
});

describe("TodoItem toggle interaction — US3", () => {
  it("renders a toggle button", () => {
    render(
      <TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: /toggle/i })).toBeInTheDocument();
  });

  it("calls onToggle with item id when toggle is clicked", async () => {
    const onToggle = vi.fn();
    render(
      <TodoItemComponent item={activeItem} onToggle={onToggle} onDelete={vi.fn()} />
    );
    await userEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(onToggle).toHaveBeenCalledWith("abc-123");
  });
});

describe("TodoItem delete interaction — US4", () => {
  it("renders a delete button", () => {
    render(
      <TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} />
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("calls onDelete with item id when delete is clicked", async () => {
    const onDelete = vi.fn();
    render(
      <TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={onDelete} />
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("abc-123");
  });
});
