import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddTodoForm } from "../../src/components/AddTodoForm";

describe("AddTodoForm component — US2", () => {
  it("renders a title input", () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    expect(screen.getByRole("textbox", { name: /title/i })).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("calls onAdd with title and null description when submitted with title only", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddTodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByRole("textbox", { name: /title/i }), "Buy eggs");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(onAdd).toHaveBeenCalledWith("Buy eggs", null);
  });

  it("calls onAdd with title and description when both provided", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddTodoForm onAdd={onAdd} />);
    await userEvent.type(screen.getByRole("textbox", { name: /title/i }), "Buy eggs");
    const descInput = screen.getByRole("textbox", { name: /description/i });
    await userEvent.type(descInput, "Free range");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(onAdd).toHaveBeenCalledWith("Buy eggs", "Free range");
  });

  it("shows inline error when submitted with empty title", async () => {
    render(<AddTodoForm onAdd={vi.fn()} />);
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("clears fields after successful submit", async () => {
    const onAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddTodoForm onAdd={onAdd} />);
    const input = screen.getByRole("textbox", { name: /title/i });
    await userEvent.type(input, "Buy eggs");
    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    expect(input).toHaveValue("");
  });
});
