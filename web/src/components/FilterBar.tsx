import "./FilterBar.css";
import type { StatusFilter } from "../types/todo";

interface Props {
  activeFilter: StatusFilter;
  onFilterChange: (filter: StatusFilter) => void;
}

const FILTERS: StatusFilter[] = ["all", "active", "completed"];

export function FilterBar({ activeFilter, onFilterChange }: Props) {
  return (
    <nav className="filter-bar" aria-label="Filter todos">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={activeFilter === f ? "filter-btn active" : "filter-btn"}
          onClick={() => onFilterChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </nav>
  );
}
