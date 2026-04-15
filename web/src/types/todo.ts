export interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string; // ISO 8601 UTC
}

export type StatusFilter = "all" | "active" | "completed";

export interface CreateTodoRequest {
  title: string;
  description?: string;
}

export interface DeleteResponse {
  message: string;
}

export interface ApiError {
  error: string;
}
