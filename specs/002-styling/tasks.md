---
description: "Task list for Modern UI Styling — 002-styling"
---

# Tasks: Modern UI Styling

**Input**: Design documents from `specs/002-styling/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, quickstart.md ✅

**Tests**: ✅ REQUIRED — TDD is NON-NEGOTIABLE per constitution §II.
For CSS-only additions, tests verify className attributes and accessible markup are present.
For component restructuring (TodoItem → `<tr>`, TodoList → `<table>`), existing tests must be
updated alongside the markup changes and must continue to pass.

**No backend changes**: This feature is frontend-only. All 56 backend tests must remain passing
and untouched.

**Organization**: Tasks grouped by user story. Each story is independently demonstrable after
its phase completes.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: User story label — [US1] through [US5]

## Path Conventions

```text
web/src/          ← React + TypeScript source
web/src/components/ ← Component .tsx and .css files
web/tests/        ← Vitest test files
```

---

## Phase 1: Setup (Global Foundations)

**Purpose**: Establish CSS token foundation, load Poppins font, wire global stylesheet. These
are prerequisites for all user story phases. No user-visible layout changes yet.

- [x] T001 Add Google Fonts `<link>` preconnect and Poppins stylesheet to `web/index.html` (weights 400, 600, 700)
- [x] T002 [P] Create `web/src/index.css` with CSS custom property tokens: `--color-bg`, `--color-surface`, `--color-border`, `--color-text`, `--color-muted`, `--color-primary`, `--color-primary-h`, `--color-danger`, `--color-done-bg`; add body reset (margin: 0, font-family: system-ui, background: var(--color-bg))
- [x] T003 [P] Update `web/src/main.tsx` to import `"./index.css"`

**Checkpoint**: `npm test` still passes (50 tests). App loads with off-white background.

---

## Phase 2: User Story 1 — Branded App Header (Priority: P1)

**Goal**: Header renders with Poppins font, `✅` and `📝` emoji, visually distinct from body text.

**Independent Test**: Render `<App>` (mocked service); assert heading contains `✅` and `📝`; assert heading element is `h1` inside `header.app-header`.

### Tests for User Story 1 — Write FIRST (must FAIL before T007) ⚠️ RED

- [x] T004 [P] [US1] Update `web/tests/components/App.test.tsx` to assert: `<h1>` text includes `✅` and `📝`; heading is wrapped in an element with `className` containing `app-header`

### Implementation for User Story 1 — GREEN

- [x] T005 [US1] Update `web/src/App.tsx`: wrap heading in `<header className="app-header">`, change `<h1>` to `<h1>✅ To-Do 📝</h1>`, add `className="app-container"` to `<main>`
- [x] T006 [P] [US1] Create `web/src/App.css` with `.app-container` (max-width: 720px, margin: 0 auto, padding: 1.5rem 1rem) and `.app-header h1` (font-family: 'Poppins', sans-serif; font-weight: 700; font-size: 2rem; color: var(--color-primary)); import `"./App.css"` in `App.tsx`

**Checkpoint**: Header shows `✅ To-Do 📝` in Poppins bold indigo. US1 tests pass.

---

## Phase 3: User Story 2 — Add-Todo Form in a Card (Priority: P2)

**Goal**: Add-todo form is enclosed in a visually distinct card with border, shadow, and padding.

**Independent Test**: Render `<AddTodoForm onAdd={vi.fn()} />`; assert the `<form>` element has `className` containing `form-card`.

### Tests for User Story 2 — Write FIRST (must FAIL before T010) ⚠️ RED

- [x] T007 [P] [US2] Update `web/tests/components/AddTodoForm.test.tsx` to assert the form element has `className` matching `form-card`; assert submit button has `className` matching `btn`

### Implementation for User Story 2 — GREEN

- [x] T008 [US2] Update `web/src/components/AddTodoForm.tsx`: add `className="form-card"` to `<form>`, wrap each label+input in `<div className="form-group">`, add `className="btn btn-primary"` to submit button, add `className="form-error"` to error `<p>`
- [x] T009 [P] [US2] Create `web/src/components/AddTodoForm.css` with `.form-card` (background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 10px; padding: 1.5rem; box-shadow: 0 2px 6px rgba(0,0,0,0.06); margin-bottom: 1.5rem), `.form-group` (margin-bottom: 0.75rem; display: flex; flex-direction: column; gap: 0.25rem), `.btn.btn-primary` (background: var(--color-primary); color: #fff; border: none; border-radius: 6px; padding: 0.5rem 1.25rem; font-size: 0.9rem; cursor: pointer), `.btn.btn-primary:hover` (background: var(--color-primary-h)), `.form-error` (color: var(--color-danger); font-size: 0.85rem; margin-top: 0.25rem); import CSS in `AddTodoForm.tsx`

**Checkpoint**: Form renders in a white card with shadow. US2 tests pass.

---

## Phase 4: User Story 3 — To-Do List as a Data Table (Priority: P3)

**Goal**: Todo list renders as a semantic `<table>` with columns for status, title/description, and actions. Completed rows are visually distinct.

**Independent Test**: Render `<TodoList items={[activeItem, completedItem]} onToggle={vi.fn()} onDelete={vi.fn()} />`; assert `getByRole("table")` exists; assert `getAllByRole("row")` length is 3 (header + 2 data rows); assert completed row has `className` containing `completed`.

### Tests for User Story 3 — Write FIRST (must FAIL before T013) ⚠️ RED

- [x] T010 [P] [US3] Rewrite `web/tests/components/TodoList.test.tsx`: use `getByRole("table")` instead of `<ul>` assumptions; use `getAllByRole("row")` for item count (header row + data rows); assert empty-state `<p>` renders when items=[]
- [x] T011 [P] [US3] Rewrite `web/tests/components/TodoItem.test.tsx`: replace `getByRole("article")` with `getByTestId("todo-row")`; add assertion for `completed` className on completed item's row; keep toggle/delete button assertions unchanged

### Implementation for User Story 3 — GREEN

- [x] T012 [US3] Rewrite `web/src/components/TodoList.tsx`: replace `<ul>/<li>` with `<table className="todo-table"><thead><tr><th>Status</th><th>Task</th><th>Actions</th></tr></thead><tbody>{items.map(...)}</tbody></table>`; keep empty-state `<p className="empty-state">No to-dos found.</p>`; import `"./TodoList.css"`
- [x] T013 [P] [US3] Rewrite `web/src/components/TodoItem.tsx`: render as `<tr data-testid="todo-row" className={item.completed ? "todo-row completed" : "todo-row"}>` with three `<td>` cells (`col-status`, `col-content`, `col-actions`); `col-content` shows `<span className="todo-title">{item.title}</span>` and optional `<span className="todo-desc">`; import `"./TodoItem.css"`
- [x] T014 [P] [US3] Create `web/src/components/TodoList.css` with `.todo-table-wrapper` (overflow-x: auto), `.todo-table` (width: 100%; border-collapse: collapse; background: var(--color-surface); border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.06)), `thead th` (background: var(--color-primary); color: #fff; padding: 0.75rem 1rem; text-align: left; font-family: 'Poppins', sans-serif; font-weight: 600), `tbody tr` (border-bottom: 1px solid var(--color-border)), `tbody tr:last-child` (border-bottom: none), `tbody tr:nth-child(even)` (background: #f5f4f2), `.todo-row.completed` (background: var(--color-done-bg)), `.todo-row.completed .todo-title` (text-decoration: line-through; color: var(--color-muted)), `.empty-state` (text-align: center; color: var(--color-muted); padding: 2rem)
- [x] T015 [P] [US3] Create `web/src/components/TodoItem.css` with `td` padding (0.75rem 1rem), `.col-status` (width: 2.5rem; text-align: center), `.col-actions` (width: 6rem; text-align: right; white-space: nowrap), `.todo-title` (font-weight: 500), `.todo-desc` (display: block; font-size: 0.8rem; color: var(--color-muted); margin-top: 0.2rem)

**Checkpoint**: List renders as a styled table. Completed rows show strikethrough. US3 tests pass.

---

## Phase 5: User Story 4 — Icon Buttons for Row Actions (Priority: P4)

**Goal**: Toggle shows `✓` icon (or `↩` for completed), delete shows `🗑`. Buttons have `aria-label` and visible focus ring.

**Independent Test**: Render one active and one completed `<TodoItem>`; assert toggle button text is `✓` for active and `↩` for completed; assert delete button text contains `🗑`; assert both buttons have non-empty `aria-label`.

### Tests for User Story 4 — Write FIRST (must FAIL before T018) ⚠️ RED

- [x] T016 [P] [US4] Update `web/tests/components/TodoItem.test.tsx`: add assertions that toggle button text is `✓` when item is active and `↩` when item is completed; assert delete button text is `🗑`; assert `aria-label` attributes are non-empty on both buttons

### Implementation for User Story 4 — GREEN

- [x] T017 [US4] Update `web/src/components/TodoItem.tsx` action buttons: toggle renders `{item.completed ? "↩" : "✓"}` as content with `aria-label={item.completed ? "Undo" : "Toggle"}` and `className="icon-btn"`; delete renders `🗑` with `aria-label="Delete"` and `className="icon-btn danger"`
- [x] T018 [P] [US4] Add icon button styles to `web/src/components/TodoItem.css`: `.icon-btn` (background: none; border: 1px solid var(--color-border); border-radius: 6px; cursor: pointer; padding: 0.3rem 0.5rem; font-size: 1rem; transition: background 0.15s), `.icon-btn:hover` (background: var(--color-primary); color: #fff; border-color: var(--color-primary)), `.icon-btn:focus-visible` (outline: 2px solid var(--color-primary); outline-offset: 2px), `.icon-btn.danger:hover` (background: var(--color-danger); border-color: var(--color-danger))

**Checkpoint**: Action column shows `✓`/`↩` and `🗑`. Focus rings visible on keyboard nav. US4 tests pass.

---

## Phase 6: User Story 5 — Conventional Filter Bar (Priority: P5)

**Goal**: Filter bar rendered as a segmented tab group between the form and list. Active filter is visually highlighted with indigo.

**Independent Test**: Render `<FilterBar activeFilter="active" onFilterChange={vi.fn()} />`; assert `<nav>` has `className` containing `filter-bar`; assert "Active" button has `className` containing `active`; assert "All" and "Completed" do not have `active` class.

### Tests for User Story 5 — Write FIRST (must FAIL before T021) ⚠️ RED

- [x] T019 [P] [US5] Update `web/tests/components/FilterBar.test.tsx`: add assertion that `<nav>` element has `className` containing `filter-bar`; add assertion that buttons have `className` containing `filter-btn`; keep existing active-state and click assertions unchanged

### Implementation for User Story 5 — GREEN

- [x] T020 [US5] Update `web/src/components/FilterBar.tsx`: add `className="filter-bar"` to `<nav>`, change button className to `filter-btn${activeFilter === f ? " active" : ""}`; import `"./FilterBar.css"`
- [x] T021 [P] [US5] Create `web/src/components/FilterBar.css` with `.filter-bar` (display: flex; gap: 0; margin-bottom: 1rem; border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden; background: var(--color-surface)), `.filter-btn` (flex: 1; border: none; background: none; padding: 0.5rem 1rem; cursor: pointer; font-size: 0.9rem; color: var(--color-text); transition: background 0.15s, color 0.15s), `.filter-btn + .filter-btn` (border-left: 1px solid var(--color-border)), `.filter-btn.active` (background: var(--color-primary); color: #fff; font-weight: 600), `.filter-btn:hover:not(.active)` (background: #f0eeff)

**Checkpoint**: Filter bar shows as a joined segmented control. Active tab is indigo. US5 tests pass.

---

## Phase 7: Polish & Verification

**Purpose**: Confirm all tests still pass, coverage still meets threshold, and verify no visual regressions were introduced by the markup changes.

- [x] T022 [P] Verify all frontend tests pass: run `npm test` in `web/` — expect 50 tests passing (zero regressions)
- [x] T023 [P] Verify frontend coverage ≥80%: run `npm run test:coverage` in `web/` — both lines and statements must stay ≥80%
- [x] T024 [P] Verify all backend tests still pass: run `python3 -m pytest --no-cov -q` in `api/` — expect 56 passed (no changes, just sanity check)

**Checkpoint**: All tests pass. Coverage gates satisfied. All 24 tasks complete.

---

## Dependencies

```text
Phase 1 (Setup — CSS tokens + font)
    └─► Phase 2 (US1 Header)      ← needs Poppins loaded
    └─► Phase 3 (US3 Table)       ← needs color tokens
    └─► Phase 4 (US3 Table CSS)   ← needs color tokens
    └─► Phase 5 (US2 Form card)   ← needs color tokens
    └─► Phase 6 (US5 Filter bar)  ← needs color tokens

Phase 4 (US3 TodoItem markup)
    └─► Phase 5 (US4 Icon buttons) ← icon buttons live inside TodoItem

All phases ──► Phase 7 (Polish & Verification)
```

**Within each story**: Test update (RED) → Markup update (GREEN) → CSS file (GREEN)

---

## Parallel Execution Examples

### Within Phase 1

```
T001 index.html Google Fonts
T002 [P] index.css tokens      ← parallel with T001
T003 [P] main.tsx import       ← parallel with T001, T002
```

### Within Phase 3

```
T010 [P] TodoList test update
T011 [P] TodoItem test update  ← parallel with T010 (different files)
```

### After tests written

```
T012 TodoList.tsx rewrite
T013 [P] TodoItem.tsx rewrite  ← parallel with T012 (different files)
T014 [P] TodoList.css          ← parallel with T013
T015 [P] TodoItem.css          ← parallel with T012, T014
```

---

## Implementation Strategy

**MVP** (after Phase 2): Branded header with Poppins and emoji — independently demonstrable.

**Incremental delivery order**:
1. Phase 1 → foundation (tokens + font)
2. Phase 2 → US1 header (visible immediately, lowest risk)
3. Phase 3 → US2 form card (additive className only)
4. Phase 4 → US3 table (largest structural change — TodoList + TodoItem rewrite)
5. Phase 5 → US4 icon buttons (small change inside TodoItem)
6. Phase 6 → US5 filter bar (additive className + new CSS file)
7. Phase 7 → verification

**Format validation**: All 24 tasks follow checklist format `- [ ] T### [P?] [Story?] Description with file path`. ✅
