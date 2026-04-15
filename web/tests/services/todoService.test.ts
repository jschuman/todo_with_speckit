import { describe, it, expect, vi, beforeEach } from "vitest";
import { getTodos, createTodo, toggleTodo, deleteTodo, API_BASE } from "../../src/services/todoService";
import type { TodoItem } from "../../src/types/todo";

const mockItem: TodoItem = {
  id: "test-uuid",
  title: "Buy milk",
  description: null,
  completed: false,
  created_at: "2026-04-14T12:00:00.000Z",
};

// ─── US1: getTodos ────────────────────────────────────────────────────────────

describe("getTodos — US1", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("calls the correct URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockItem],
    });
    vi.stubGlobal("fetch", fetchMock);
    await getTodos();
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/todos`);
  });

  it("returns typed TodoItem array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [mockItem],
    }));
    const result = await getTodos();
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Buy milk");
  });

  it("returns empty array when API returns []", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    }));
    const result = await getTodos();
    expect(result).toEqual([]);
  });
});

// ─── US2: createTodo ─────────────────────────────────────────────────────────

describe("createTodo — US2", () => {
  it("POSTs to /todos with title and description", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockItem,
    });
    vi.stubGlobal("fetch", fetchMock);
    await createTodo({ title: "Buy milk", description: "Whole milk" });
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/todos`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "Content-Type": "application/json" }),
        body: JSON.stringify({ title: "Buy milk", description: "Whole milk" }),
      })
    );
  });

  it("returns the created TodoItem", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockItem,
    }));
    const result = await createTodo({ title: "Buy milk" });
    expect(result.id).toBe("test-uuid");
    expect(result.completed).toBe(false);
  });
});

// ─── US3: toggleTodo ─────────────────────────────────────────────────────────

describe("toggleTodo — US3", () => {
  it("PATCHes the correct toggle URL", async () => {
    const toggled = { ...mockItem, completed: true };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => toggled,
    });
    vi.stubGlobal("fetch", fetchMock);
    await toggleTodo("test-uuid");
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/todos/test-uuid/toggle`,
      expect.objectContaining({ method: "PATCH" })
    );
  });

  it("returns the updated TodoItem", async () => {
    const toggled = { ...mockItem, completed: true };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => toggled,
    }));
    const result = await toggleTodo("test-uuid");
    expect(result.completed).toBe(true);
  });
});

// ─── US4: deleteTodo ─────────────────────────────────────────────────────────

describe("deleteTodo — US4", () => {
  it("DELETEs the correct URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Deleted successfully" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    await deleteTodo("test-uuid");
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_BASE}/todos/test-uuid`,
      expect.objectContaining({ method: "DELETE" })
    );
  });

  it("returns DeleteResponse", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Deleted successfully" }),
    }));
    const result = await deleteTodo("test-uuid");
    expect(result.message).toBe("Deleted successfully");
  });
});

// ─── US5: getTodos with status filter ────────────────────────────────────────

describe("getTodos with status filter — US5", () => {
  it("appends ?status=active when filter is active", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);
    await getTodos("active");
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/todos?status=active`);
  });

  it("appends ?status=completed when filter is completed", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);
    await getTodos("completed");
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/todos?status=completed`);
  });

  it("omits status param when filter is all", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);
    await getTodos("all");
    expect(fetchMock).toHaveBeenCalledWith(`${API_BASE}/todos`);
  });
});

// ─── Error paths ─────────────────────────────────────────────────────────────

describe("service error paths", () => {
  it("getTodos throws on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    await expect(getTodos()).rejects.toThrow("Failed to fetch todos");
  });

  it("createTodo throws with server error message on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Title is required" }),
    }));
    await expect(createTodo({ title: "" })).rejects.toThrow("Title is required");
  });

  it("toggleTodo throws with server error message on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Todo item not found" }),
    }));
    await expect(toggleTodo("missing")).rejects.toThrow("Todo item not found");
  });

  it("deleteTodo throws with server error message on non-ok response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Todo item not found" }),
    }));
    await expect(deleteTodo("missing")).rejects.toThrow("Todo item not found");
  });
});
