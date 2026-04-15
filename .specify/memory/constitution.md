<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0 [INITIAL RATIFICATION]
Modified principles: N/A — first-time fill
Added sections: Core Principles (×6), Technology Stack, Development Workflow, Governance
Removed sections: N/A
Templates requiring updates:
  ✅ plan-template.md — Constitution Check gates now resolvable from this document
  ✅ spec-template.md — Scope/requirements align with principles (no structural changes needed)
  ✅ tasks-template.md — TDD principle mandates test tasks; tasks template already marks tests as optional
    per-spec; projects governed by this constitution MUST mark tests as required in spec
Follow-up TODOs: None — all fields resolved
-->

# To-Do Application Constitution

## Core Principles

### I. API-First

All application functionality MUST be fully exposed through the Python Flask backend API before
any frontend (UI) work begins on that capability. The API contract is the source of truth.
No feature is considered "started" until its backend endpoint exists and is tested.

**Rationale**: Decouples delivery pace of backend from frontend; ensures the API is independently
usable (e.g., by CLI tools, tests, or future clients) and prevents UI assumptions from leaking
into the domain model.

### II. Test-Driven Development (NON-NEGOTIABLE)

TDD is mandatory and non-negotiable across the entire codebase:

- All API endpoints MUST have unit tests written **before** implementation code is merged.
- All React components MUST have module-level tests written before the component is considered done.
- Minimum **80% code coverage** is required for both backend and frontend at all times.
- The Red-Green-Refactor cycle MUST be followed: write a failing test, make it pass, then refactor.
- Pull requests that reduce coverage below 80% MUST be rejected.

**Rationale**: TDD is the primary quality gate. Coverage thresholds are enforced as an objective,
measurable proxy for discipline — not as a substitute for meaningful tests.

### III. Simplicity

Use the simplest approach that solves the problem at hand. YAGNI (You Aren't Gonna Need It) applies:

- The API MUST use in-memory state only — no database, no ORM, no persistence layer.
- Do not introduce abstractions for anticipated future requirements not currently specified.
- Prefer flat structures over nested hierarchies unless complexity genuinely demands otherwise.
- Dependencies MUST be justified; each new library or framework requires explicit rationale.

**Rationale**: This is a demo application. Over-engineering wastes time and obscures the
architectural patterns the project is intended to demonstrate.

### IV. Clean Architecture

The backend MUST follow Clean/Onion Architecture with strict layer dependency rules:

- **Domain**: Pure business logic and entities. Depends on nothing outside itself.
- **Application**: Use-cases and service orchestration. Depends on Domain only.
- **Infrastructure**: Implements interfaces defined in Application/Domain (e.g., in-memory store).
- **Web (API layer)**: Composes and wires everything; handles HTTP concerns only.

No layer may import from or depend on a layer that is outer to it. Violations MUST be caught
in code review and are grounds for PR rejection.

**Rationale**: Clean Architecture makes business logic independently testable and future-proof
against transport/infrastructure changes, even in a simple app.

### V. Clean Separation

The backend (Python Flask) and frontend (React with TypeScript) are separate projects within
the same repository:

- Each project MUST have its own `package.json` / `pyproject.toml`, test runner, and linter config.
- No shared code, shared modules, or direct imports across the backend/frontend boundary.
- The ONLY permitted coupling between backend and frontend is the HTTP API contract.
- The API contract (request/response shapes) MUST be documented (e.g., OpenAPI or equivalent)
  and treated as a versioned interface.

**Rationale**: Separation enforces that each side can be developed, tested, and deployed
independently. It also mirrors real-world professional project structure.

### VI. Type Safety

Strong typing is non-negotiable on both sides of the stack:

- **Frontend**: TypeScript strict mode (`"strict": true`) MUST be enabled. Use of `any` is
  forbidden. All API response types MUST be explicitly typed.
- **Backend**: All domain models and API request/response shapes MUST use strongly-typed
  Python dataclasses, Pydantic models, or equivalent. Anonymous `dict` objects MUST NOT
  cross layer boundaries.
- Generated or inferred types from external sources MUST be validated at system boundaries.

**Rationale**: Type safety eliminates an entire class of runtime bugs and makes refactoring
safe across both codebases.

## Technology Stack

The following stack is **fixed** for this project. Deviations require a constitution amendment.

| Layer | Technology |
|---|---|
| Backend language | Python 3.11+ |
| Backend framework | Flask (Minimal API style — no Flask-RESTful or heavy extensions) |
| Backend architecture | Clean/Onion Architecture |
| Backend state | In-memory only (no database) |
| Backend testing | pytest + pytest-cov |
| Frontend language | TypeScript (strict mode) |
| Frontend framework | React |
| Frontend testing | Vitest or Jest + React Testing Library |
| API contract | HTTP/JSON; OpenAPI spec or equivalent markdown contract doc |

## Development Workflow

1. **API-first gate**: Backend endpoint + unit tests MUST exist and pass before frontend
   work on the same feature begins.
2. **TDD gate**: Tests are written first, confirmed to fail, then implementation proceeds.
3. **Coverage gate**: CI MUST block merges if backend or frontend coverage falls below 80%.
4. **Layer gate**: Code review MUST verify no Clean Architecture layer violations.
5. **Type gate**: No `any` in TypeScript; no untyped dict boundaries in Python.
6. **Separation gate**: No cross-project imports. All frontend↔backend communication via HTTP.

All gates MUST pass before a pull request is eligible to merge.

## Governance

This constitution supersedes all other practices, conventions, and preferences documented
elsewhere. In the event of a conflict, this document governs.

- Amendments MUST increment the version using semantic versioning:
  - **MAJOR**: Removal or incompatible redefinition of a principle.
  - **MINOR**: New principle or materially expanded guidance added.
  - **PATCH**: Wording clarifications or non-semantic refinements.
- Amendments MUST update `Last Amended` and be committed with the message format:
  `docs: amend constitution to vX.Y.Z (<summary of change>)`
- All pull requests MUST include a constitution compliance check confirming no gates are
  violated.
- Complexity deviations (e.g., adding a database) MUST be recorded in the `plan.md`
  Complexity Tracking table with justification before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-04-14 | **Last Amended**: 2026-04-14
