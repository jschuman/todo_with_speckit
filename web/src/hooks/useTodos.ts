import { useCallback, useEffect, useState } from "react";
import { createTodo, deleteTodo, getTodos, toggleTodo } from "../services/todoService";
import type { StatusFilter, TodoItem } from "../types/todo";

export interface UseTodosReturn {
  todos: TodoItem[];
  activeFilter: StatusFilter;
  error: string | null;
  loading: boolean;
  setFilter: (filter: StatusFilter) => void;
  addTodo: (title: string, description: string | null) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("all");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTodos = useCallback(async (filter: StatusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTodos(filter);
      setTodos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTodos(activeFilter);
  }, [activeFilter, fetchTodos]);

  const setFilter = useCallback((filter: StatusFilter) => {
    setActiveFilter(filter);
  }, []);

  const addTodo = useCallback(
    async (title: string, description: string | null) => {
      setError(null);
      const item = await createTodo({ title, description: description ?? undefined });
      setTodos((prev) => [...prev, item]);
    },
    []
  );

  const toggleItem = useCallback(async (id: string) => {
    setError(null);
    const updated = await toggleTodo(id);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    setError(null);
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { todos, activeFilter, error, loading, setFilter, addTodo, toggleItem, deleteItem };
}
