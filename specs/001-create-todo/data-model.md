# Data Model: To-Do Application

**Branch**: `001-create-todo` | **Date**: 2026-04-14
**Source**: spec.md §Key Entities + research.md decisions

---

## Core Entity: TodoItem

### Canonical Fields

| Field | Python Type | JSON Key | JSON Type | Nullable | Constraints |
|---|---|---|---|---|---|
| id | `str` | `id` | `string` | No | UUID v4; server-generated; immutable |
| title | `str` | `title` | `string` | No | 1–200 chars; stripped of leading/trailing whitespace |
| description | `str \| None` | `description` | `string \| null` | Yes | Max 1000 chars; `null` when not provided |
| completed | `bool` | `completed` | `boolean` | No | Default `false` on creation |
| created_at | `str` | `created_at` | `string` | No | ISO 8601 UTC, e.g. `"2026-04-14T12:00:00.000Z"` |

### Python Representation (`api/src/todo/domain/entities.py`)

```python
from dataclasses import dataclass, field
from datetime import datetime, timezone
import uuid

@dataclass
class TodoItem:
    id: str
    title: str
    completed: bool
    created_at: str
    description: str | None = None

    @staticmethod
    def create(title: str, description: str | None = None) -> "TodoItem":
        return TodoItem(
            id=str(uuid.uuid4()),
            title=title.strip(),
            description=description.strip() if description else None,
            completed=False,
            created_at=datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z"),
        )

    def toggle(self) -> "TodoItem":
        return TodoItem(
            id=self.id,
            title=self.title,
            description=self.description,
            completed=not self.completed,
            created_at=self.created_at,
        )
```

### TypeScript Representation (`web/src/types/todo.ts`)

```typescript
export interface TodoItem {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  created_at: string; // ISO 8601 UTC
}

export type StatusFilter = "all" | "active" | "completed";
```

---

## DTOs

### CreateTodoRequest

| Field | Required | JSON Type | Constraints |
|---|---|---|---|
| `title` | Yes | `string` | 1–200 chars after strip |
| `description` | No | `string \| null` | Max 1000 chars after strip; omit or send `null` |

**Python DTO** (`api/src/todo/application/dtos.py`):
```python
from dataclasses import dataclass

@dataclass
class CreateTodoRequest:
    title: str
    description: str | None = None
```

**TypeScript** (`web/src/types/todo.ts`):
```typescript
export interface CreateTodoRequest {
  title: string;
  description?: string;
}
```

### TodoResponse

The API always returns the full `TodoItem` shape defined above. No separate response DTO needed.

### DeleteResponse

```json
{ "message": "Deleted successfully" }
```

**TypeScript** (`web/src/types/todo.ts`):
```typescript
export interface DeleteResponse {
  message: string;
}
```

### ErrorResponse

```json
{ "error": "<human-readable message>" }
```

**TypeScript** (`web/src/types/todo.ts`):
```typescript
export interface ApiError {
  error: string;
}
```

---

## State Transitions

```text
[Creation]
    │
    ▼
  active (completed = false)
    │
  toggle()
    │
    ▼
completed (completed = true)
    │
  toggle()
    │
    ▼
  active (completed = false)
    │
  delete()
    │
    ▼
  [Removed — no longer exists]
```

---

## Validation Rules

| Rule | Field | Condition | Error |
|---|---|---|---|
| V-001 | `title` | Empty or whitespace-only after strip | `422` — `"Title is required"` |
| V-002 | `title` | Exceeds 200 characters after strip | `422` — `"Title must not exceed 200 characters"` |
| V-003 | `description` | Exceeds 1000 characters after strip | `422` — `"Description must not exceed 1000 characters"` |
| V-004 | `status` (query param) | Not in `{all, active, completed}` | `422` — `"Invalid status value. Must be one of: all, active, completed"` |
| V-005 | `id` (path param) | Item with given ID does not exist | `404` — `"Todo item not found"` |

---

## Domain Interface (`api/src/todo/domain/interfaces.py`)

```python
from typing import Protocol
from .entities import TodoItem

class ITodoRepository(Protocol):
    def get_all(self, completed: bool | None = None) -> list[TodoItem]: ...
    def get_by_id(self, id: str) -> TodoItem | None: ...
    def add(self, item: TodoItem) -> TodoItem: ...
    def update(self, item: TodoItem) -> TodoItem: ...
    def delete(self, id: str) -> bool: ...
```

---

## In-Memory Collection Structure

```python
# api/src/todo/infrastructure/in_memory_repository.py
# Internal: dict[str, TodoItem], keyed by todo.id
# add() — inserts; raises ValueError if id already exists (defensive)
# get_all() — returns sorted list (created_at ascending) optionally filtered by completed
# get_by_id() — dict lookup by id; returns None if not found
# update() — replaces entry; returns updated item
# delete() — removes entry; returns True if existed, False if not
```
