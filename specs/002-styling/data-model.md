# Data Model: Modern UI Styling (002-styling)

**Branch**: `002-styling` | **Date**: 2026-04-15

No new domain entities or data model changes. This feature is purely presentational.

---

## CSS Architecture

```text
web/
├── index.html                        ← Add Google Fonts <link> tags
├── src/
│   ├── index.css                     ← NEW: CSS custom properties, resets, body/page styles
│   ├── App.css                       ← NEW: .app-container, header, layout
│   ├── main.tsx                      ← UPDATE: import "./index.css"
│   ├── App.tsx                       ← UPDATE: add classNames, header markup with emoji
│   └── components/
│       ├── AddTodoForm.tsx           ← UPDATE: add className="form-card" to <form>
│       ├── AddTodoForm.css           ← NEW: card styles
│       ├── FilterBar.tsx             ← UPDATE: add classNames to nav + buttons
│       ├── FilterBar.css             ← NEW: segmented filter tab styles
│       ├── TodoList.tsx              ← UPDATE: replace <ul>/<li> with <table>/<tbody>/<tr>
│       ├── TodoList.css              ← NEW: table styles
│       ├── TodoItem.tsx              ← UPDATE: render as <tr> with <td> cells + Unicode icons
│       └── TodoItem.css              ← NEW: row styles, completed state
```

---

## CSS Custom Properties (`:root` in `index.css`)

| Token | Value | Usage |
|---|---|---|
| `--color-bg` | `#faf9f7` | Page background |
| `--color-surface` | `#ffffff` | Card / table surface |
| `--color-border` | `#e5e1d8` | Borders and dividers |
| `--color-text` | `#2d2926` | Body text |
| `--color-muted` | `#9e9890` | Completed item text |
| `--color-primary` | `#6366f1` | Buttons, active states |
| `--color-primary-h` | `#4f46e5` | Button hover |
| `--color-danger` | `#ef4444` | Delete button hover |
| `--color-done-bg` | `#f0fdf4` | Completed row background tint |

---

## Component Markup Changes

### `App.tsx`
- `<main>` → `<main className="app-container">`
- Title becomes: `<header className="app-header"><h1>✅ To-Do 📝</h1></header>`
- Loading paragraph: `<p className="loading-text">Loading…</p>`

### `AddTodoForm.tsx`
- `<form>` → `<form className="form-card" ...>`
- Inputs wrapped in `.form-group` divs
- Submit button gets `className="btn btn-primary"`
- Error alert gets `className="form-error"`

### `FilterBar.tsx`
- `<nav>` → `<nav className="filter-bar" aria-label="Filter todos">`
- Each button: `className={activeFilter === f ? "filter-btn active" : "filter-btn"}`

### `TodoList.tsx`
- Replace `<ul>/<li>` with `<table className="todo-table"><thead>…</thead><tbody>…</tbody></table>`
- Empty state: `<p className="empty-state">No to-dos found.</p>`

### `TodoItem.tsx`
- Render as `<tr className={item.completed ? "todo-row completed" : "todo-row"}>`
- Cells: `<td className="col-status">`, `<td className="col-content">`, `<td className="col-actions">`
- Toggle button: `<button aria-label="Toggle" className="icon-btn">✓</button>`
- Delete button: `<button aria-label="Delete" className="icon-btn danger">🗑</button>`

---

## Test Changes Required

| File | Old selector | New selector |
|---|---|---|
| `TodoItem.test.tsx` | `getByRole("article")` | `closest("tr")` via test-id, or wrap `<tr>` with `data-testid="todo-row"` |
| `TodoList.test.tsx` | `getAllByRole("article")` | `getAllByRole("row")` (table rows) |

**Strategy**: `TodoItem` renders as a `<tr>`. Tests will use `getAllByRole("row")` on the table (filtering out the header row) or a `data-testid="todo-row"` attribute.
