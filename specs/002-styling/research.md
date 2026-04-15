# Research: Modern UI Styling (002-styling)

**Branch**: `002-styling` | **Date**: 2026-04-15

---

## Decision 1: CSS Architecture

**Decision**: One global stylesheet (`web/src/index.css`) imported in `main.tsx`, plus one CSS file per component co-located in `web/src/components/` (e.g., `TodoItem.css`). App-level layout in `web/src/App.css`.

**Rationale**: Co-located CSS keeps component styles close to the component without requiring a build plugin for CSS Modules. Plain imports (`import "./TodoItem.css"`) work out-of-the-box with Vite. No new dependencies required.

**Alternatives considered**:
- CSS Modules — requires `.module.css` naming and `styles.className` syntax in JSX; adds complexity for a demo app.
- Tailwind — violates FR-010 (no external CSS frameworks) and the Simplicity principle.
- Single global file — acceptable but harder to maintain as file grows; per-component files preferred.

---

## Decision 2: Google Fonts loading

**Decision**: Add a single `<link>` preconnect + stylesheet tag in `web/index.html` to load `Poppins:wght@400;600;700` from Google Fonts. Apply `font-family: 'Poppins', sans-serif` to the `h1` in `App.css`.

**Rationale**: Zero build-time dependencies. Fonts load asynchronously. `preconnect` minimises latency. Body text remains the browser default (system-ui/sans-serif) per Simplicity principle.

**Alternatives considered**:
- Self-hosting font files — adds asset management overhead not justified for a demo.
- `@import` in CSS — blocks CSS parsing; `<link>` in `<head>` is faster.

---

## Decision 3: Table vs CSS Grid for the to-do list

**Decision**: Use a semantic `<table>` element with columns: Status (icon/badge), Title+Description, Actions.

**Rationale**: FR-004 specifies "HTML table or CSS-grid table equivalent". Semantic `<table>` provides built-in accessibility (screen readers announce column headers), requires no extra ARIA, and aligns naturally with tabular data. Column widths controlled via `colgroup` or `th` width declarations.

**Alternatives considered**:
- CSS Grid with `display: grid` — more flexible layout control but loses semantic table accessibility without manual ARIA.

---

## Decision 4: Component markup changes needed

The following components need `className` attributes added (no structural changes):

| Component | Change |
|---|---|
| `App.tsx` | Add `className="app-container"` to `<main>`, wrap header in `<header>` with emoji + title |
| `AddTodoForm.tsx` | Add `className="form-card"` to `<form>` |
| `FilterBar.tsx` | Add `className="filter-bar"` to `<nav>`, `className="filter-btn active"` / `"filter-btn"` to buttons |
| `TodoList.tsx` | Replace `<ul>/<li>` with `<table>/<tbody>/<tr>` structure |
| `TodoItem.tsx` | Render as `<tr>` with `<td>` cells; replace button text with Unicode icons |

**Impact on tests**: Component tests use `getByRole("article")` for `TodoItem` — changing to `<tr>` breaks this. Tests must be updated alongside the component changes.

---

## Decision 5: Icon strategy

**Decision**: Unicode characters inline in JSX — `✓` for toggle (active items), `↩` for toggle (completed items as "undo"), `🗑` for delete. Wrapped in `<button>` with explicit `aria-label`.

**Rationale**: Zero dependencies. Spec confirmed Unicode (Q3 answer: A). The `aria-label` satisfies FR-007 and SC-004. Emoji render consistently on macOS/iOS/Windows/Android for the target demo context.

**Alternatives considered**: Inline SVGs — more precise rendering control but adds verbosity to JSX with no meaningful benefit for a demo.

---

## Decision 6: Color tokens (CSS custom properties)

**Decision**: Define a small set of CSS custom properties on `:root` in `index.css`:

```css
:root {
  --color-bg:        #faf9f7;   /* off-white page background */
  --color-surface:   #ffffff;   /* card/table surface */
  --color-border:    #e5e1d8;   /* warm-gray border */
  --color-text:      #2d2926;   /* near-black body text */
  --color-muted:     #9e9890;   /* muted/completed text */
  --color-primary:   #6366f1;   /* indigo action color */
  --color-primary-h: #4f46e5;   /* hover variant */
  --color-danger:    #ef4444;   /* delete button hover */
  --color-done-bg:   #f0fdf4;   /* completed row tint */
}
```

**Rationale**: Custom properties make the palette consistent and easy to update without hunting through multiple files.

---

## Decision 7: Test updates required

Existing tests affected by markup changes:

| Test file | Current assertion | Required change |
|---|---|---|
| `TodoItem.test.tsx` | `getByRole("article")` | Change component to use `role="row"` or update test to use a different selector |
| `TodoList.test.tsx` | `getAllByRole("article")` | Update after TodoList changes to table |

**Strategy**: Update test assertions in the same task as the component markup change (same commit). Tests must still pass (SC-003).

---

## Decision 8: No new npm dependencies

**Decision**: Zero new packages. All styling via plain CSS files. Google Fonts via CDN `<link>`. Unicode icons inline.

**Rationale**: Fully satisfies FR-010 (plain CSS only) and Simplicity principle. No `package.json` changes.
