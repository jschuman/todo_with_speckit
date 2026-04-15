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

describe("TodoItem component — US1/US3", () => {
  it("renders the title", () => {
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.getByText("Buy milk")).toBeInTheDocument();
  });

  it("renders description when present", () => {
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.getByText("Whole milk")).toBeInTheDocument();
  });

  it("does not render description element when null", () => {
    render(
      <table><tbody><TodoItemComponent item={noDescItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.queryByTestId("todo-description")).not.toBeInTheDocument();
  });

  it("row does not have completed class for active item", () => {
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    const row = screen.getByTestId("todo-row");
    expect(row.className).not.toMatch(/completed/);
  });

  it("row has completed class for completed item", () => {
    render(
      <table><tbody><TodoItemComponent item={completedItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    const row = screen.getByTestId("todo-row");
    expect(row.className).toMatch(/completed/);
  });
});

describe("TodoItem toggle interaction — US3/US4", () => {
  it("renders a toggle button", () => {
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.getByRole("button", { name: /toggle/i })).toBeInTheDocument();
  });

  it("toggle button shows ✓ for active item", () => {
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.getByRole("button", { name: /toggle/i }).textContent).toBe("✓");
  });

  it("toggle button shows ↩ for completed item", () => {
    render(
      <table><tbody><TodoItemComponent item={completedItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.getByRole("button", { name: /undo/i }).textContent).toBe("↩");
  });

  it("calls onToggle with item id when toggle is clicked", async () => {
    const onToggle = vi.fn();
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={onToggle} onDelete={vi.fn()} /></tbody></table>
    );
    await userEvent.click(screen.getByRole("button", { name: /toggle/i }));
    expect(onToggle).toHaveBeenCalledWith("abc-123");
  });
});

describe("TodoItem delete interaction — US4", () => {
  it("renders a delete button", () => {
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
  });

  it("delete button shows 🗑", () => {
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={vi.fn()} /></tbody></table>
    );
    expect(screen.getByRole("button", { name: /delete/i }).textContent).toBe("🗑");
  });

  it("calls onDelete with item id when delete is clicked", async () => {
    const onDelete = vi.fn();
    render(
      <table><tbody><TodoItemComponent item={activeItem} onToggle={vi.fn()} onDelete={onDelete} /></tbody></table>
    );
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("abc-123");
  });
});
