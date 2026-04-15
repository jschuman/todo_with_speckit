import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterBar } from "../../src/components/FilterBar";
import type { StatusFilter } from "../../src/types/todo";

describe("FilterBar component — US5", () => {
  it("renders All, Active, and Completed buttons", () => {
    render(<FilterBar activeFilter="all" onFilterChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /active/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /completed/i })).toBeInTheDocument();
  });

  it("nav element has filter-bar className", () => {
    render(<FilterBar activeFilter="all" onFilterChange={vi.fn()} />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toMatch(/filter-bar/);
  });

  it("buttons have filter-btn className", () => {
    render(<FilterBar activeFilter="all" onFilterChange={vi.fn()} />);
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => expect(btn.className).toMatch(/filter-btn/));
  });

  it("marks the active filter button as selected", () => {
    render(<FilterBar activeFilter="active" onFilterChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /active/i }).className).toMatch(/active/);
    expect(screen.getByRole("button", { name: /all/i }).className).not.toMatch(/\bactive\b/);
  });

  it("calls onFilterChange with 'active' when Active is clicked", async () => {
    const onFilterChange = vi.fn();
    render(<FilterBar activeFilter="all" onFilterChange={onFilterChange} />);
    await userEvent.click(screen.getByRole("button", { name: /active/i }));
    expect(onFilterChange).toHaveBeenCalledWith<[StatusFilter]>("active");
  });

  it("calls onFilterChange with 'completed' when Completed is clicked", async () => {
    const onFilterChange = vi.fn();
    render(<FilterBar activeFilter="all" onFilterChange={onFilterChange} />);
    await userEvent.click(screen.getByRole("button", { name: /completed/i }));
    expect(onFilterChange).toHaveBeenCalledWith<[StatusFilter]>("completed");
  });

  it("calls onFilterChange with 'all' when All is clicked", async () => {
    const onFilterChange = vi.fn();
    render(<FilterBar activeFilter="active" onFilterChange={onFilterChange} />);
    await userEvent.click(screen.getByRole("button", { name: /all/i }));
    expect(onFilterChange).toHaveBeenCalledWith<[StatusFilter]>("all");
  });
});
