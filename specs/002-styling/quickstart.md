# Quickstart: Modern UI Styling (002-styling)

**Branch**: `002-styling` | **Date**: 2026-04-15

No new dependencies. No setup changes from `001-create-todo`.

---

## Run the Frontend

```bash
cd web
npm run dev
# → http://localhost:5173
```

## Run Frontend Tests

```bash
cd web
npm test
npm run test:coverage   # must remain ≥80%
```

## Key Files Changed by This Feature

| File | Change type |
|---|---|
| `web/index.html` | Add Google Fonts `<link>` |
| `web/src/main.tsx` | Add `import "./index.css"` |
| `web/src/index.css` | NEW — CSS tokens + body reset |
| `web/src/App.tsx` | Header markup + classNames |
| `web/src/App.css` | NEW — layout styles |
| `web/src/components/TodoItem.tsx` | `<tr>`-based markup + Unicode icons |
| `web/src/components/TodoItem.css` | NEW |
| `web/src/components/TodoList.tsx` | `<table>` markup |
| `web/src/components/TodoList.css` | NEW |
| `web/src/components/AddTodoForm.tsx` | `form-card` className |
| `web/src/components/AddTodoForm.css` | NEW |
| `web/src/components/FilterBar.tsx` | `filter-bar` / `filter-btn` classNames |
| `web/src/components/FilterBar.css` | NEW |
| `web/tests/components/TodoItem.test.tsx` | Update role selectors |
| `web/tests/components/TodoList.test.tsx` | Update role selectors |

## No Backend Changes

This feature is frontend-only. The Flask API is unchanged.
