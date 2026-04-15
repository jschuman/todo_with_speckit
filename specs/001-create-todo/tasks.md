---
description: "Task list for To-Do Application — 001-create-todo"
---

# Tasks: To-Do Application

**Input**: Design documents from `specs/001-create-todo/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.md ✅

**Tests**: ⛔ REQUIRED — TDD is NON-NEGOTIABLE per constitution §II.
Test tasks appear FIRST within each user story phase. Tests MUST be written to FAIL before
implementation tasks are started. Red-Green-Refactor cycle is mandatory.

**API-First**: Per constitution §I, all backend tasks for a user story MUST complete before
frontend tasks for the same user story begin.

**Organization**: Tasks are grouped by user story. Each story is independently testable after
its phase completes.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no incomplete-task dependencies)
- **[Story]**: User story label — [US1] through [US5]
- Exact file paths included in every task description

## Path Conventions

```text
api/   ← Python Flask backend (Clean Architecture)
web/   ← React + TypeScript frontend (Vite)
```

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize both projects with correct structure, dependencies, and tooling config.
No features yet — just scaffolding and config so tests can be run.

- [x] T001 Create `api/` Python project: `api/pyproject.toml` (Flask, Flask-CORS, pytest, pytest-flask, pytest-cov deps), `api/src/todo/__init__.py` and all sub-package `__init__.py` files per plan.md structure
- [x] T002 [P] Create `web/` frontend project via Vite: `web/package.json`, `web/tsconfig.json` (strict mode), `web/vite.config.ts` (Vitest + jsdom + coverage provider), `web/src/main.tsx`, `web/src/App.tsx` stubs
- [x] T003 Configure pytest coverage threshold ≥80% in `api/pyproject.toml` (`[tool.pytest.ini_options]` and `[tool.coverage.report]` fail_under = 80)
- [x] T004 [P] Configure Vitest coverage threshold ≥80% in `web/vite.config.ts` (coverage.thresholds all: 80, provider: v8)

**Checkpoint**: `cd api && pytest` runs (0 tests, no errors). `cd web && npm test` runs (0 tests, no errors).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create structural skeletons for all layers so TDD tests can be written against
stubs in user story phases. No business logic yet — just class/method shells.

**⚠️ CRITICAL**: No user story test can be written until this phase is complete.

- [x] T005 Create `TodoItem` dataclass skeleton in `api/src/todo/domain/entities.py` (fields: id, title, description, completed, created_at; stub `create()` and `toggle()` methods that raise `NotImplementedError`)
- [x] T006 [P] Create `ITodoRepository` Protocol in `api/src/todo/domain/interfaces.py` (methods: `get_all`, `get_by_id`, `add`, `update`, `delete` — signatures only, no body)
- [x] T007 [P] Create `CreateTodoRequest` dataclass in `api/src/todo/application/dtos.py` (fields: title: str, description: str | None = None)
- [x] T008 Create `InMemoryTodoRepository` skeleton in `api/src/todo/infrastructure/in_memory_repository.py` (class with `_store: dict[str, TodoItem]`; stubs for all `ITodoRepository` methods that raise `NotImplementedError`)
- [x] T009 Create `TodoService` skeleton in `api/src/todo/application/services.py` (constructor takes `ITodoRepository`; stub methods `list_todos`, `create_todo`, `toggle_todo`, `delete_todo` that raise `NotImplementedError`)
- [x] T010 Create Flask app factory in `api/src/todo/web/app.py` (`create_app(repo=None)` — configures Flask, registers Flask-CORS for `http://localhost:5173`, wires `InMemoryTodoRepository` and `TodoService` via app context, registers Blueprint)
- [x] T011 Create `/todos` Blueprint skeleton in `api/src/todo/web/routes.py` (Blueprint `todos_bp`; stub route handlers for `GET /todos`, `POST /todos`, `PATCH /todos/<id>/toggle`, `DELETE /todos/<id>` — each returns `501 Not Implemented` for now)
- [x] T012 Create `api/tests/conftest.py` with `app` and `client` fixtures using `create_app()`, and a `todo_repo` fixture that exposes the shared `InMemoryTodoRepository` for direct test seeding; create empty `api/tests/unit/` and `api/tests/integration/` directories with `__init__.py`
- [x] T013 [P] Create TypeScript types in `web/src/types/todo.ts` (`TodoItem`, `StatusFilter`, `CreateTodoRequest`, `DeleteResponse`, `ApiError` interfaces per data-model.md)
- [x] T014 [P] Create `todoService.ts` skeleton in `web/src/services/todoService.ts` (stub exported async functions: `getTodos`, `createTodo`, `toggleTodo`, `deleteTodo` — each throws `Error("not implemented")`)
- [x] T015 [P] Create `useTodos.ts` hook skeleton in `web/src/hooks/useTodos.ts` (stub hook returning empty state; will be filled per user story)

**Checkpoint**: All skeleton files exist. `pytest` still runs without import errors. `npm test` compiles without TypeScript errors.

---

## Phase 3: User Story 1 — View All To-Do Items (Priority: P1) 🎯 MVP

**Goal**: `GET /todos` returns all items as a JSON array. React app displays the list (or empty state).

**Independent Test**: Seed the in-memory repository with 2 items via `todo_repo` fixture;
call `GET /todos`; assert `200 OK` and both items in response. Separately, render `<TodoList>`
with mock data and assert items are displayed with title, description, and status.

### Tests for User Story 1 — Write FIRST (must FAIL before T022) ⚠️ RED

- [x] T016 [P] [US1] Write unit tests for `TodoItem.create()` (correct fields, UUID id, completed=False, stripped title) and field defaults in `api/tests/unit/test_entities.py`
- [x] T017 [P] [US1] Write unit tests for `TodoService.list_todos()` (returns all items, returns empty list) using a mock `ITodoRepository` in `api/tests/unit/test_services.py`
- [x] T018 [P] [US1] Write integration tests for `GET /todos` (200 OK returns `[]`, 200 OK returns seeded items with correct shape) in `api/tests/integration/test_api.py`
- [x] T019 [P] [US1] Write tests for `todoService.getTodos()` (fetch called with correct URL, parses response, returns `TodoItem[]`) in `web/tests/services/todoService.test.ts`
- [x] T020 [P] [US1] Write tests for `<TodoItem>` component (renders title, description when present, null description hidden, shows active/completed state) in `web/tests/components/TodoItem.test.tsx`
- [x] T021 [P] [US1] Write tests for `<TodoList>` component (renders list of items, renders empty-state message when items=[]) in `web/tests/components/TodoList.test.tsx`

### Implementation for User Story 1 — GREEN

- [x] T022 [US1] Implement `TodoItem.create()` factory and dataclass fields in `api/src/todo/domain/entities.py` (UUID v4 id, strip title, ISO 8601 UTC created_at, completed=False)
- [x] T023 [US1] Implement `InMemoryTodoRepository.add()` and `get_all()` (sorted by created_at ascending, optional `completed: bool | None` filter param) in `api/src/todo/infrastructure/in_memory_repository.py`
- [x] T024 [US1] Implement `TodoService.list_todos()` (delegates to repo `get_all`, returns `list[TodoItem]`) in `api/src/todo/application/services.py`
- [x] T025 [US1] Implement `GET /todos` route (calls service, serializes to JSON list using `dataclasses.asdict`, returns 200) in `api/src/todo/web/routes.py`
- [x] T026 [US1] Implement `todoService.getTodos()` (fetch GET `/todos`, typed return `Promise<TodoItem[]>`) in `web/src/services/todoService.ts`
- [x] T027 [P] [US1] Implement `<TodoItem>` component (displays title, optional description, completed badge/style) in `web/src/components/TodoItem.tsx`
- [x] T028 [US1] Implement `<TodoList>` component (maps items to `<TodoItem>`, empty-state message when list empty) in `web/src/components/TodoList.tsx`
- [x] T029 [US1] Implement `useTodos` hook initial load (calls `getTodos()` on mount, exposes `todos` state) in `web/src/hooks/useTodos.ts`
- [x] T030 [US1] Implement `App.tsx` (renders `<TodoList todos={todos}/>`, handles loading state) in `web/src/App.tsx`

**Checkpoint**: `GET /todos` returns `[]` or a seeded list. React app renders the list on load. All US1 tests pass. MVP independently demonstrable.

---

## Phase 4: User Story 2 — Add a New To-Do Item (Priority: P2)

**Goal**: `POST /todos` creates an item and returns `201 Created`. React form submits and new item appears in list without page reload.

**Independent Test**: `POST /todos {"title": "Buy milk"}` → `201` + item in body with `completed: false`. `POST /todos {"title": ""}` → `422` + `{"error": "Title is required"}`. Render `<AddTodoForm>`, submit, assert new item appears in list.

### Tests for User Story 2 — Write FIRST (must FAIL before T035) ⚠️ RED

- [x] T031 [P] [US2] Write unit tests for `TodoService.create_todo()` (valid input creates item, blank title raises 422, title> 200 chars raises 422, description > 1000 chars raises 422) in `api/tests/unit/test_services.py`
- [x] T032 [P] [US2] Write integration tests for `POST /todos` (201 with full item body, 422 blank title, 422 whitespace title, 422 title too long, 201 with description, 201 without description) in `api/tests/integration/test_api.py`
- [x] T033 [P] [US2] Write tests for `todoService.createTodo()` (fetch POST with body, returns `TodoItem`, typed) in `web/tests/services/todoService.test.ts`
- [x] T034 [P] [US2] Write tests for `<AddTodoForm>` (renders title input, submit button, calls onAdd with title+description, shows inline error on empty submit, clears form after submit) in `web/tests/components/AddTodoForm.test.tsx`

### Implementation for User Story 2 — GREEN

- [x] T035 [US2] Implement `TodoService.create_todo()` (blank/whitespace title → `ValueError`, title > 200 chars → `ValueError`, description > 1000 chars → `ValueError`, creates and stores `TodoItem`) in `api/src/todo/application/services.py`
- [x] T036 [US2] Implement `POST /todos` route (parses JSON body, calls `create_todo`, returns 201 + item; catches `ValueError` → 422 + `{"error": "..."}`) in `api/src/todo/web/routes.py`
- [x] T037 [US2] Implement `todoService.createTodo()` (fetch POST `/todos`, typed `Promise<TodoItem>`) in `web/src/services/todoService.ts`
- [x] T038 [US2] Implement `<AddTodoForm>` component (controlled inputs for title and description, client-side blank-title validation, calls `onAdd` prop callback) in `web/src/components/AddTodoForm.tsx`
- [x] T039 [US2] Wire `<AddTodoForm>` into `useTodos` hook (`createTodo` refreshes list) and render in `App.tsx` in `web/src/hooks/useTodos.ts` and `web/src/App.tsx`

**Checkpoint**: `POST /todos` creates items and rejects blank titles. Form submits and item appears in list. US2 tests pass. US1 + US2 both independently testable.

---

## Phase 5: User Story 3 — Toggle Completion Status (Priority: P3)

**Goal**: `PATCH /todos/<id>/toggle` flips `completed` and returns updated item. React item immediately shows new status on click.

**Independent Test**: Create item via `todo_repo`, `PATCH /todos/<id>/toggle` → `200` + `completed: true`. Toggle again → `completed: false`. `PATCH /todos/unknown/toggle` → `404`. Click toggle button on `<TodoItem>` → completed style applied.

### Tests for User Story 3 — Write FIRST (must FAIL before T044) ⚠️ RED

- [x] T040 [P] [US3] Write unit tests for `TodoItem.toggle()` (active→completed, completed→active, all other fields unchanged) in `api/tests/unit/test_entities.py`
- [x] T041 [P] [US3] Write unit tests for `TodoService.toggle_todo()` (item found → toggled, item not found → raises `KeyError`) in `api/tests/unit/test_services.py`
- [x] T042 [P] [US3] Write integration tests for `PATCH /todos/<id>/toggle` (200 + toggled item, 404 unknown id) in `api/tests/integration/test_api.py`
- [x] T043 [P] [US3] Write tests for `todoService.toggleTodo()` (fetch PATCH correct URL, returns updated `TodoItem`) in `web/tests/services/todoService.test.ts`
- [x] T044 [P] [US3] Write tests for `<TodoItem>` toggle interaction (toggle button rendered, click calls `onToggle` with item id) in `web/tests/components/TodoItem.test.tsx`

### Implementation for User Story 3 — GREEN

- [x] T045 [US3] Implement `TodoItem.toggle()` (returns new `TodoItem` with `completed` flipped) in `api/src/todo/domain/entities.py`
- [x] T046 [US3] Implement `InMemoryTodoRepository.get_by_id()` and `update()` in `api/src/todo/infrastructure/in_memory_repository.py`
- [x] T047 [US3] Implement `TodoService.toggle_todo()` (fetch by id, call `toggle()`, store via `update`, return updated item; raise `KeyError` if not found) in `api/src/todo/application/services.py`
- [x] T048 [US3] Implement `PATCH /todos/<id>/toggle` route (calls service, returns 200 + item; catches `KeyError` → 404 + `{"error": "Todo item not found"}`) in `api/src/todo/web/routes.py`
- [x] T049 [US3] Implement `todoService.toggleTodo()` (fetch PATCH `/todos/<id>/toggle`, no body, typed `Promise<TodoItem>`) in `web/src/services/todoService.ts`
- [x] T050 [US3] Add toggle button to `<TodoItem>` component and wire `onToggle` prop callback in `web/src/components/TodoItem.tsx`; add `toggleTodo` to `useTodos` hook in `web/src/hooks/useTodos.ts`

**Checkpoint**: Toggle flips status and UI updates immediately. US3 tests pass.

---

## Phase 6: User Story 4 — Delete a To-Do Item (Priority: P4)

**Goal**: `DELETE /todos/<id>` removes item and returns `{"message": "Deleted successfully"}`. React item disappears from list without page reload.

**Independent Test**: Create item, `DELETE /todos/<id>` → `200 {"message": "Deleted successfully"}`. `GET /todos` → item gone. `DELETE /todos/unknown` → `404`. Click delete button → item removed from all filter views.

### Tests for User Story 4 — Write FIRST (must FAIL before T055) ⚠️ RED

- [x] T051 [P] [US4] Write unit tests for `TodoService.delete_todo()` (existing id deleted and returns True, unknown id raises `KeyError`) in `api/tests/unit/test_services.py`
- [x] T052 [P] [US4] Write integration tests for `DELETE /todos/<id>` (200 + `{"message": "Deleted successfully"}`, item absent from subsequent GET, 404 unknown id) in `api/tests/integration/test_api.py`
- [x] T053 [P] [US4] Write tests for `todoService.deleteTodo()` (fetch DELETE correct URL, returns `DeleteResponse`) in `web/tests/services/todoService.test.ts`
- [x] T054 [P] [US4] Write tests for `<TodoItem>` delete interaction (delete button rendered, click calls `onDelete` with item id) in `web/tests/components/TodoItem.test.tsx`

### Implementation for User Story 4 — GREEN

- [x] T055 [US4] Implement `InMemoryTodoRepository.delete()` (removes by key, returns True if existed, False if not) in `api/src/todo/infrastructure/in_memory_repository.py`
- [x] T056 [US4] Implement `TodoService.delete_todo()` (calls `repo.delete`, raises `KeyError` if not found) in `api/src/todo/application/services.py`
- [x] T057 [US4] Implement `DELETE /todos/<id>` route (calls service, returns 200 + `{"message": "Deleted successfully"}`; catches `KeyError` → 404 + `{"error": "Todo item not found"}`) in `api/src/todo/web/routes.py`
- [x] T058 [US4] Implement `todoService.deleteTodo()` (fetch DELETE `/todos/<id>`, typed `Promise<DeleteResponse>`) in `web/src/services/todoService.ts`
- [x] T059 [US4] Add delete button to `<TodoItem>` component and wire `onDelete` prop callback in `web/src/components/TodoItem.tsx`
- [x] T060 [US4] Add `deleteTodo` to `useTodos` hook (removes item from local state on success) in `web/src/hooks/useTodos.ts`

**Checkpoint**: Deleted item disappears from list under all filters. US4 tests pass.

---

## Phase 7: User Story 5 — Filter To-Do Items by Status (Priority: P5)

**Goal**: `GET /todos?status=active|completed|all` returns filtered items. React `<FilterBar>` triggers re-fetch with status param; empty state shown when no items match.

**Independent Test**: Seed 1 active + 1 completed item. `GET /todos?status=active` → only active item. `GET /todos?status=completed` → only completed. `GET /todos?status=all` → both. `GET /todos?status=invalid` → 422. Click filter buttons → correct items shown.

### Tests for User Story 5 — Write FIRST (must FAIL before T065) ⚠️ RED

- [x] T061 [P] [US5] Write unit tests for `TodoService.list_todos()` with `status` param (all, active only, completed only, invalid value raises ValueError) in `api/tests/unit/test_services.py`
- [x] T062 [P] [US5] Write integration tests for `GET /todos?status=` (200 active-only, 200 completed-only, 200 all, 200 no-param=all, 422 invalid value) in `api/tests/integration/test_api.py`
- [x] T063 [P] [US5] Write tests for `todoService.getTodos(status)` (URL includes `?status=active`, omits param when "all") in `web/tests/services/todoService.test.ts`
- [x] T064 [P] [US5] Write tests for `<FilterBar>` component (renders All/Active/Completed buttons, active filter highlighted, click calls `onFilterChange` with correct value) in `web/tests/components/FilterBar.test.tsx`

### Implementation for User Story 5 — GREEN

- [x] T065 [US5] Implement status filter in `InMemoryTodoRepository.get_all()` (accept `completed: bool | None`; filter dict values accordingly) in `api/src/todo/infrastructure/in_memory_repository.py`
- [x] T066 [US5] Implement status filter in `TodoService.list_todos()` (accept `status: str = "all"`; validate against `{"all","active","completed"}` raising `ValueError` for invalid; pass `completed` bool to repo) in `api/src/todo/application/services.py`
- [x] T067 [US5] Implement `?status=` query param parsing and validation in `GET /todos` route (read `request.args.get("status","all")`, call service, catch `ValueError` → 422 + `{"error": "Invalid status value. Must be one of: all, active, completed"}`) in `api/src/todo/web/routes.py`
- [x] T068 [US5] Update `todoService.getTodos()` to accept optional `status` param and append `?status=<value>` when not "all" in `web/src/services/todoService.ts`
- [x] T069 [US5] Implement `<FilterBar>` component (All/Active/Completed buttons, highlights active filter, calls `onFilterChange: (f: StatusFilter) => void`) in `web/src/components/FilterBar.tsx`
- [x] T070 [US5] Wire `<FilterBar>` into `useTodos` hook (`activeFilter` state triggers re-fetch with status param) and render in `App.tsx` in `web/src/hooks/useTodos.ts` and `web/src/App.tsx`

**Checkpoint**: All three filters work. Empty-state shows when filter matches no items. US5 tests pass.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, coverage gates, and final integration validation.

- [x] T071 [P] Add API error display to `App.tsx` (`ErrorBanner` inline — shows error message when any service call fails, clears on next successful operation) in `web/src/App.tsx`
- [x] T072 [P] Verify backend coverage ≥80%: run `pytest --cov=src/todo --cov-report=term-missing` in `api/`; add targeted tests for any uncovered branches until threshold passes
- [x] T073 [P] Verify frontend coverage ≥80%: run `npm run test:coverage` in `web/`; add targeted tests for any uncovered branches until threshold passes

**Checkpoint**: Both `pytest --cov` and `npm run test:coverage` exit 0 with ≥80% coverage. All 73 tasks complete.

---

## Dependencies

```text
Phase 1 (Setup)
    └─► Phase 2 (Foundational)
            └─► Phase 3 (US1) ──────────────────────────► MVP complete
            └─► Phase 4 (US2)  ← independent after Phase 2
            └─► Phase 5 (US3)  ← independent after Phase 2
            └─► Phase 6 (US4)  ← independent after Phase 2
            └─► Phase 7 (US5)  ← independent after Phase 2
                     │
                     └─────────────────────────────────► Phase 8 (Polish)
```

**Within each story**: Backend tests (RED) → Backend implementation (GREEN) → Frontend tests (RED) → Frontend implementation (GREEN)

**API-First constraint**: All backend tasks in a story MUST be green before ANY frontend tasks for that story begin.

---

## Parallel Execution Examples

### Within Phase 2 (Foundational)

```
T005 Domain entities
T006 [P] Domain interfaces    ← parallel with T005
T007 [P] Application DTOs     ← parallel with T005, T006
T013 [P] TypeScript types     ← parallel with T005-T012 (different project)
T014 [P] todoService skeleton ← parallel with T013
T015 [P] useTodos skeleton    ← parallel with T013, T014
```

### Within each User Story (test-writing phase)

```
T016 [P] Entity unit tests
T017 [P] Service unit tests   ← parallel with T016 (different file)
T018 [P] Integration tests    ← parallel with T016, T017
T019 [P] Frontend service tests ← parallel (after backend skeletons exist)
T020 [P] Component tests      ← parallel with T019
T021 [P] Component tests      ← parallel with T019, T020
```

### Cross-story parallelism (after Phase 2)

Different user stories CAN be developed in parallel by separate developers, as each maps to
distinct files. However, the natural dependency chain (you need items before you can toggle or
delete them) means sequential development is recommended for a single developer.

---

## Implementation Strategy

**MVP**: Complete Phase 1 + Phase 2 + Phase 3 (US1) = `GET /todos` backend + list frontend.
Demonstrates the full Clean Architecture stack end-to-end before adding more features.

**Incremental delivery**:
1. Phase 3 (US1) → Visible list of items (read-only)
2. Phase 4 (US2) → Items can be created
3. Phase 5 (US3) → Items can be toggled
4. Phase 6 (US4) → Items can be deleted
5. Phase 7 (US5) → Items can be filtered
6. Phase 8 → Coverage gates enforced

Each phase is a shippable increment that satisfies additional user stories.

---

## Format Validation

All 73 tasks follow the required format:
- ✅ Every task starts with `- [ ]`
- ✅ Every task has a sequential ID (T001–T073)
- ✅ `[P]` appears only where tasks operate on different files with no incomplete-task dependencies
- ✅ `[US1]`–`[US5]` appear on all and only user story phase tasks (Phases 3–7)
- ✅ Every task includes an exact file path
- ✅ Test tasks precede implementation tasks within each user story phase
