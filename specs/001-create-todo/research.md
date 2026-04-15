# Research: To-Do Application

**Branch**: `001-create-todo` | **Date**: 2026-04-14
**Phase**: 0 — Unknowns resolved before design

---

## 1. Clean Architecture in Python Flask

**Decision**: Layer code as Python packages: `domain`, `application`, `infrastructure`, `web`
inside `api/src/todo/`. Each layer is a separate package. The dependency flow is enforced by
import discipline: inner layers never import from outer layers.

**Rationale**: Flask has no built-in layering mechanism. Python packages are the idiomatic
boundary unit. Using a single top-level `todo` package with sub-packages per layer keeps the
import paths clear (`todo.domain`, `todo.application`, etc.) and makes violations mechanically
visible via linting (e.g., a `domain` module importing from `web` is a direct import path
violation that no tool needs to infer).

**Alternatives considered**:
- Flat module structure — rejected: violates Clean Architecture requirement in constitution §IV
- Separate top-level packages per layer — rejected: makes Flask app factory awkward to compose

---

## 2. In-Memory Storage for Python (ConcurrentDictionary equivalent)

**Decision**: Plain Python `dict` keyed by `str` (UUID), owned by the `InMemoryTodoRepository`
class. No thread-safety mechanism needed.

**Rationale**: Flask's development server is single-threaded by default. This is a demo
application with no requirement for concurrent access. The Simplicity principle (constitution §III)
prohibits introducing concurrency primitives for requirements that do not exist. The `dict`
lives as an instance variable on the repository, which is instantiated once at app-factory time
and injected through the application layer.

**Alternatives considered**:
- `threading.Lock` around dict mutations — rejected: unnecessary complexity for a demo with a
  single-threaded dev server; YAGNI
- SQLite in-memory — rejected: violates FR-011 (no database) and constitution §III

---

## 3. Backend Testing Framework

**Decision**: `pytest` + `pytest-flask` + `pytest-cov`

**Rationale**: The constitution §Technology Stack mandates `pytest + pytest-cov`. `pytest-flask`
provides the `client` test fixture automatically from the Flask app factory, keeping integration
tests concise. `pytest-cov` enforces the 80% coverage threshold.

> ⚠️ **Conflict resolved**: User plan arguments referenced `xUnit`, `FluentAssertions`, and
> `Microsoft.AspNetCore.Mvc.Testing` — these are .NET/C# frameworks and do not apply to Python
> Flask. Constitution governs; these references are discarded.

**Alternatives considered**:
- `unittest` — rejected: pytest is more expressive and is the constitution-mandated choice
- `hypothesis` (property-based) — out of scope for this feature; YAGNI

---

## 4. Unique Identifier Type

**Decision**: UUID v4, stored and returned as a lowercase hyphenated string
(e.g., `"a4f8e2c1-..."`)

**Rationale**: UUIDs are server-generated with negligible collision probability, require no
counter state, and are idiomatic for REST APIs. String serialization is simpler than handling
UUID objects on both Python and TypeScript sides. The spec requires auto-generated server-side
IDs (FR-005) — UUID satisfies this without any counter or sequence infrastructure.

**Alternatives considered**:
- Auto-increment integer — rejected: requires a counter, has ordering assumptions, and is
  slightly less realistic as a demo API pattern
- ULID — rejected: adds a dependency (ulid-py); UUID from stdlib is sufficient

---

## 5. Completion Status Representation

**Decision**: Boolean `completed` field (`false` = active, `true` = completed) in both the
Python entity and the JSON response.

**Rationale**: A boolean is the simplest possible representation and maps directly to the
toggle semantics (`not item.completed`). Both Python `dataclasses` and TypeScript can express
this natively without a string-to-enum mapping step. The spec uses "active/completed" in user
language but the implementation field name `completed: bool` is cleaner and unambiguous.

**Alternatives considered**:
- String enum `"active"|"completed"` — rejected: requires string mapping in both languages;
  adds no expressive power over a boolean for a binary state; increases risk of typos
- Integer `0|1` — rejected: not idiomatic in JSON APIs; unclear intent

---

## 6. Timestamp Format

**Decision**: ISO 8601 UTC string, e.g., `"2026-04-14T12:34:56.789Z"`
using `datetime.utcnow().isoformat() + "Z"` on the Python side; parsed natively as a
JavaScript `Date` string on the TypeScript side.

**Rationale**: ISO 8601 is the universally understood JSON date format. Returning a string
(not epoch integer) means both the frontend can display it and tests can assert on its format
without conversion. The `Z` suffix signals UTC explicitly.

**Alternatives considered**:
- Unix epoch integer — rejected: requires conversion at every display point; less readable in
  test assertions
- Python `datetime` object serialized without format control — rejected: Flask's default JSON
  encoder produces RFC 2822 format, which is less readable

---

## 7. Title Maximum Length

**Decision**: 200 characters

**Rationale**: 200 chars covers any realistic to-do title. It is memorable, easy to document,
and consistent with common web form conventions. Exceeded titles return `422` with
`{"error": "Title must not exceed 200 characters"}`.

**Alternatives considered**:
- 255 (database varchar default) — rejected: no database; the choice has no technical basis here;
  YAGNI
- No maximum — rejected: without a bound, a malicious or buggy client could flood the in-memory
  store with arbitrarily large strings (OWASP A05 Security Misconfiguration; even a demo should
  not be trivially abusable)

---

## 8. HTTP Status Codes — All Endpoints

Fills checklist gaps CHK014–CHK016.

| Operation | Endpoint | Success Code | Error Codes |
|---|---|---|---|
| List / Filter | `GET /todos` | `200 OK` | `422` (invalid `status` param) |
| Create | `POST /todos` | `201 Created` | `422` (blank/too-long title) |
| Toggle | `PATCH /todos/<id>/toggle` | `200 OK` | `404` (item not found) |
| Delete | `DELETE /todos/<id>` | `200 OK` | `404` (item not found) |

> ⚠️ **Conflict resolved**: User plan arguments specified `204 No Content` for delete.
> FR-007 (explicitly clarified in `/speckit.clarify` session 2026-04-14) requires
> `200 OK` with body `{"message": "Deleted successfully"}`. The clarified spec governs.

---

## 9. Query Parameter Validation (CHK018–CHK020)

**Decision**: Accept only lowercase `active`, `completed`, or `all` (or absent). Any other
value returns `422 Unprocessable Entity` with `{"error": "Invalid status value. Must be one
of: all, active, completed"}`. Case folding (accepting `Active`) is NOT performed.

**Rationale**: Strict validation is simpler to implement and test than case-folding. The API
contract states lowercase values; client code should honour the contract. Strict validation also
surfaces bugs in client code early (OWASP A03 Injection — query parameter injection).

---

## 10. CORS Configuration

**Decision**: Use `flask-cors` (`Flask-CORS` package). Allow only `http://localhost:5173`
(Vite default port) in development. Configure via the app factory so it can be overridden
per environment.

**Rationale**: `flask-cors` is the idiomatic Flask CORS extension. Restricting the allowed
origin to the Vite dev server origin (rather than `*`) is more secure even for a demo (OWASP
A05). The origin is passed as configuration so tests can run with `TESTING=True` without
needing a live frontend.

---

## 11. Frontend API Communication

**Decision**: `fetch` API only. No Axios. All API calls encapsulated in
`web/src/services/todoService.ts`. Components never call `fetch` directly.

**Rationale**: Consistent with user's stated preference and constitution §V (no coupling beyond
HTTP contract). A typed service layer (`todoService.ts`) ensures all frontend↔backend shapes are
defined in one place (`web/src/types/todo.ts`).

---

## 12. Filtering Mechanism (confirmed from clarification)

**Decision**: Server-side via `?status=active|completed|all` query parameter on `GET /todos`.
Omitting the parameter is equivalent to `?status=all`.

**Rationale**: Confirmed in spec clarification session 2026-04-14. Aligns with API-First
constitution principle §I — all behaviour must be testable without a frontend.

---

## Summary of All Resolved Unknowns

| # | Unknown | Resolved To |
|---|---|---|
| 1 | Python Clean Architecture layering | `domain` / `application` / `infrastructure` / `web` packages |
| 2 | In-memory collection type | Python `dict` (no concurrency needed) |
| 3 | Backend test framework | `pytest` + `pytest-flask` + `pytest-cov` |
| 4 | ID type | UUID v4 string |
| 5 | Status field representation | `completed: boolean` |
| 6 | Timestamp format | ISO 8601 UTC string |
| 7 | Title max length | 200 characters |
| 8 | All HTTP status codes | See table above |
| 9 | Invalid status query param | `422` with error message; no case folding |
| 10 | CORS | `flask-cors` limiting to `http://localhost:5173` |
| 11 | Frontend HTTP | `fetch` only; all calls in `todoService.ts` |
| 12 | Filtering | Server-side `?status=` parameter |
