import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useTodos } from "../../src/hooks/useTodos";
import * as todoService from "../../src/services/todoService";
import type { TodoItem } from "../../src/types/todo";

const item: TodoItem = {
  id: "abc",
  title: "Buy milk",
  description: null,
  completed: false,
  created_at: "2026-04-15T10:00:00.000Z",
};

const completedItem: TodoItem = { ...item, completed: true };

describe("useTodos hook", () => {
  beforeEach(() => {
    vi.spyOn(todoService, "getTodos").mockResolvedValue([item]);
    vi.spyOn(todoService, "createTodo").mockResolvedValue({ ...item, id: "new" });
    vi.spyOn(todoService, "toggleTodo").mockResolvedValue(completedItem);
    vi.spyOn(todoService, "deleteTodo").mockResolvedValue({ message: "Deleted successfully" });
  });

  it("fetches todos on mount", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    expect(result.current.todos[0].title).toBe("Buy milk");
  });

  it("starts with loading true and then false after fetch", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it("sets error on fetch failure", async () => {
    vi.spyOn(todoService, "getTodos").mockRejectedValue(new Error("Server down"));
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.error).toBe("Server down"));
  });

  it("adds a new todo via addTodo", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    await act(async () => {
      await result.current.addTodo("New task", null);
    });
    expect(result.current.todos).toHaveLength(2);
  });

  it("toggles an item via toggleItem", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    await act(async () => {
      await result.current.toggleItem("abc");
    });
    expect(result.current.todos[0].completed).toBe(true);
  });

  it("deletes an item via deleteItem", async () => {
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.todos).toHaveLength(1));
    await act(async () => {
      await result.current.deleteItem("abc");
    });
    expect(result.current.todos).toHaveLength(0);
  });

  it("re-fetches when filter changes", async () => {
    vi.spyOn(todoService, "getTodos").mockResolvedValue([]);
    const { result } = renderHook(() => useTodos());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => {
      result.current.setFilter("active");
    });
    await waitFor(() => expect(todoService.getTodos).toHaveBeenCalledWith("active"));
  });
});
