import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { App } from "../../src/App";
import * as todoService from "../../src/services/todoService";
import type { TodoItem } from "../../src/types/todo";

const item: TodoItem = {
  id: "1",
  title: "Test todo",
  description: null,
  completed: false,
  created_at: "2026-04-15T10:00:00.000Z",
};

describe("App component", () => {
  beforeEach(() => {
    vi.spyOn(todoService, "getTodos").mockResolvedValue([]);
  });

  it("renders the heading", async () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /to-do/i })).toBeInTheDocument();
  });

  it("header contains ✅ and 📝 emoji", async () => {
    render(<App />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.textContent).toMatch(/✅/);
    expect(heading.textContent).toMatch(/📝/);
  });

  it("heading is inside a banner/header element with app-header class", async () => {
    render(<App />);
    const banner = screen.getByRole("banner");
    expect(banner.className).toMatch(/app-header/);
  });

  it("shows items loaded from the service", async () => {
    vi.spyOn(todoService, "getTodos").mockResolvedValue([item]);
    render(<App />);
    await waitFor(() => expect(screen.getByText("Test todo")).toBeInTheDocument());
  });

  it("shows empty state when no items", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getByText(/no to-dos/i)).toBeInTheDocument());
  });

  it("shows error message when fetch fails", async () => {
    vi.spyOn(todoService, "getTodos").mockRejectedValue(new Error("Network error"));
    render(<App />);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Network error"));
  });
});
