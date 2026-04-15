import type { CreateTodoRequest, DeleteResponse, StatusFilter, TodoItem } from "../types/todo";

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export async function getTodos(status: StatusFilter = "all"): Promise<TodoItem[]> {
  const url = status === "all" ? `${API_BASE}/todos` : `${API_BASE}/todos?status=${status}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json() as Promise<TodoItem[]>;
}

export async function createTodo(req: CreateTodoRequest): Promise<TodoItem> {
  const res = await fetch(`${API_BASE}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    throw new Error(err.error);
  }
  return res.json() as Promise<TodoItem>;
}

export async function toggleTodo(id: string): Promise<TodoItem> {
  const res = await fetch(`${API_BASE}/todos/${id}/toggle`, { method: "PATCH" });
  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    throw new Error(err.error);
  }
  return res.json() as Promise<TodoItem>;
}

export async function deleteTodo(id: string): Promise<DeleteResponse> {
  const res = await fetch(`${API_BASE}/todos/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = (await res.json()) as { error: string };
    throw new Error(err.error);
  }
  return res.json() as Promise<DeleteResponse>;
}
