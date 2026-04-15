# Copilot Instructions Reference

> The complete `.github/copilot-instructions.md` file that defines project guardrails, architecture standards, and workflow rules for GitHub Copilot. Copy this file into your project before running Spec Kit.

[← Back to All Labs](index.html)

---

## Contents

- [Project Context](#project-context)
- [Spec-Driven Development Workflow](#spec-driven-development--no-vibe-coding)
- [.NET Backend Standards](#net-backend-standards-c)
- [React Frontend Standards](#react-frontend-standards-typescript)
- [Testing Standards](#testing-standards)
- [Git Practices](#git-practices)

---

## Project Context

- **Backend:** Python Flask API, Clean/Onion Architecture
- **Frontend:** React with TypeScript (Vite)
- **State:** In-memory on the API, no database
- This is a demo application — keep it simple but architecturally sound

---

## Spec-Driven Development — NO Vibe Coding

This project uses GitHub Spec Kit for spec-driven development. **ALL** code generation and implementation MUST flow through the Spec Kit workflow. Do not generate source code, scaffold projects, create files, or run build commands outside of `/speckit` commands.

### The Workflow (Execute in This Exact Order)

| Step | Command | Purpose | Input Required |
|------|---------|---------|----------------|
| 1 | `/speckit.constitution` | Set non-negotiable project principles and rules | Your principles as arguments |
| 2 | `/speckit.specify` | Define WHAT to build — user stories and acceptance criteria | Feature description as arguments |
| 3 | `/speckit.clarify` | Find and resolve ambiguities in the spec (recommended) | Optional focus areas as arguments |
| 4 | `/speckit.checklist` | Validate spec quality — "unit tests for English" (optional) | Optional domain focus as arguments |
| 5 | `/speckit.plan` | Define HOW to build — tech stack, architecture, research | Tech stack choices as arguments |
| 6 | `/speckit.tasks` | Break the plan into ordered, actionable tasks with file paths | No arguments needed |
| 7 | `/speckit.analyze` | Cross-check spec, plan, and tasks for gaps (recommended) | No arguments needed |
| 8 | `/speckit.implement` | Execute the tasks in order — this is the ONLY step that writes code | No arguments needed |

### What Each Command Produces

| Command | Output |
|---------|--------|
| `constitution` | `.specify/memory/constitution.md` (project principles) |
| `specify` | `specs/{feature}/spec.md` (user stories, acceptance criteria, requirements) |
| `clarify` | Updates `spec.md` with resolved ambiguities |
| `checklist` | `specs/{feature}/checklists/` (requirements quality validation) |
| `plan` | `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md` |
| `tasks` | `specs/{feature}/tasks.md` (phased task breakdown with dependencies) |
| `analyze` | Read-only consistency report (does not modify files) |
| `implement` | Actual source code, tests, and project scaffolding |

### Workflow Rules — Follow These Strictly

> ⛔ **WARNING**
>
> 1. **Never skip steps.** Each command depends on the output of the previous one.
> 2. **Never implement outside of `/speckit.implement`.** Do not scaffold projects, create source files, install packages, or run `dotnet`/`npm`/`node` commands unless executing within `/speckit.implement`.
> 3. **Never suggest next steps that bypass the workflow.** After `/speckit.tasks`, do NOT offer to start coding. Wait for the user to run `/speckit.implement`.
> 4. **The constitution is the highest authority.** If a suggestion conflicts with `.specify/memory/constitution.md`, the constitution wins.
> 5. **The spec drives decisions.** Do not add features, libraries, or components not defined in the spec and plan.
> 6. **Tests before implementation.** If the constitution or plan requires testing, test tasks execute before their corresponding implementation tasks.
> 7. **Stay in your lane.** Each `/speckit` command has a defined scope. Do not combine steps or try to be helpful by doing more than the current command requires.
> 8. **One task at a time.** During `/speckit.implement`, complete each task fully before moving to the next. Mark tasks `[x]` in tasks.md as they complete.

### Feature Branch Convention

Spec Kit detects the active feature from your Git branch name:

- Branch: `001-create-todo` → Feature directory: `specs/001-create-todo/`
- If not using Git branches, set `SPECIFY_FEATURE=001-create-todo` as an environment variable

---

## .NET Backend Standards (C#)

### Architecture: Clean / Onion

Follow Clean Architecture with dependency inversion. Inner layers never depend on outer layers.

```
api/
├── src/
│   ├── Domain/              ← Innermost: entities, value objects, interfaces
│   │   ├── Entities/
│   │   ├── Enums/
│   │   ├── Exceptions/
│   │   └── Interfaces/      ← Repository and service interfaces defined here
│   ├── Application/          ← Use cases, business logic, DTOs
│   │   ├── Common/
│   │   ├── DTOs/
│   │   ├── Interfaces/      ← Application service interfaces
│   │   ├── Services/
│   │   └── Validators/
│   ├── Infrastructure/       ← Implementations of domain/application interfaces
│   │   ├── Persistence/     ← In-memory repository implementations
│   │   └── Services/
│   └── Web/                  ← Minimal API endpoints, middleware, DI config
│       ├── Endpoints/
│       └── Middleware/
└── tests/
    ├── Domain.UnitTests/
    ├── Application.UnitTests/
    └── Web.IntegrationTests/
```

### Dependency Flow

| Layer | Depends On |
|-------|-----------|
| **Domain** | Nothing |
| **Application** | Domain only |
| **Infrastructure** | Domain and Application (implements their interfaces) |
| **Web** | All layers (composes and configures DI) |

### Coding Conventions

- Use Python Flask idiomatic patterns and Python coding conventions
- Use PascalCase for classes, methods, properties; camelCase for locals and parameters
- Enable nullable reference types (`#nullable enable`)
- Use `async/await` for all I/O operations
- Treat warnings as errors — no compiler warnings allowed
- Use linting and formatting tools (e.g., EditorConfig, StyleCop) to enforce consistent style
- Use Static Analysis tools (e.g., SonarLint) to catch code smells and maintain code quality
- Use strongly-typed models for all request/response types — never pass raw strings or anonymous objects through layers

### Minimal API Patterns

- Use Minimal API pattern — no controllers, no `[ApiController]`
- Group endpoints logically using `MapGroup()` or static extension methods
- Return proper HTTP status codes: `201 Created`, `204 No Content`, `404 Not Found`, `400 Bad Request`
- Use `TypedResults` for compile-time return type checking
- Handle errors using middleware and Problem Details (RFC 7807)
- Configure CORS to allow the Vite dev server origin
- Documented with OpenAPI annotations in code and generate Swagger docs automatically

### Dependency Injection

- Register all services through DI in `Program.cs`
- Use constructor injection — no service locators, no static state
- Domain interfaces defined in Domain layer, implemented in Infrastructure
- Use `IOptions<T>` pattern for configuration — no hardcoded values

### Patterns to Follow ✅

- Use Dependency Injection for all services and repositories
- Use FluentValidation for input validation
- Use `ILogger<T>` for structured logging
- Map between domain entities and DTOs explicitly — do not expose entities directly in API responses
- Keep endpoint definitions thin — delegate all logic to Application services

### Patterns to Avoid ❌

- No logic in endpoint definitions — delegate to services
- No static state or service locators
- No hardcoded configuration — use `appsettings.json` and `IOptions<T>`
- No exposing domain entities directly in API responses
- No fat endpoint files or God classes
- No `any` equivalent — always use strongly-typed models

---

## React Frontend Standards (TypeScript)

### Project Structure

```
web/
├── src/
│   ├── components/          ← Reusable UI components
│   ├── pages/               ← Page-level components
│   ├── services/            ← API client functions
│   ├── types/               ← TypeScript interfaces and types
│   ├── hooks/               ← Custom React hooks
│   └── utils/               ← Helper functions
└── tests/
    ├── components/          ← Component tests
    └── services/            ← Service/module tests
```

### Coding Conventions

- Use TypeScript in strict mode — `"strict": true` in `tsconfig.json`
- Use `interface` for object shapes, `type` for unions and intersections
- Use functional components with hooks — no class components
- Use `async/await` — no `.then().catch()` chains
- Use named exports for components and functions
- Keep components small and single-responsibility
- Prefer named functions over anonymous arrow functions for top-level declarations

### API Communication

- Use `fetch` for API calls — no Axios or other HTTP libraries
- Create a typed API service layer in `services/` — components never call `fetch` directly
- Define request/response types in `types/` that mirror the API contract
- Handle loading, error, and success states explicitly

### State Management

- Use React `useState` and `useReducer` for local and component state
- Use prop drilling or React Context for shared state — no Redux, Zustand, or other global state libraries
- Lift state to the nearest common ancestor when sharing between components

### Patterns to Follow ✅

- Validate props using TypeScript types — not runtime prop validation libraries
- Use custom hooks to encapsulate reusable logic
- Handle errors with clear user-facing messages
- Keep components pure when possible — side effects in hooks only

### Patterns to Avoid ❌

- Never use `any` — define proper types for everything
- No logic duplication between components and services
- No deeply nested callbacks
- No hardcoded API URLs — use environment variables or config
- No global mutable state outside of React's state management

---

## Testing Standards

> ⚠️ **Coverage Requirement:** Minimum 80% code coverage on BOTH backend and frontend. This is non-negotiable per the constitution.

### Backend Testing (Python Flask)

| Aspect | Standard |
|--------|----------|
| **Framework** | xUnit with FluentAssertions |
| **Integration tests** | `Microsoft.AspNetCore.Mvc.Testing` with `WebApplicationFactory<T>` |
| **Mocking** | Moq or NSubstitute for isolating dependencies |
| **Pattern** | Arrange-Act-Assert for all tests |
| **Verify coverage** | `dotnet test --collect:"XPlat Code Coverage"` |

**Scope:**

- **Domain.UnitTests** — entity behavior, value object validation
- **Application.UnitTests** — service logic, validation rules
- **Web.IntegrationTests** — endpoint contracts, HTTP status codes, request/response shapes

### Frontend Testing (React)

| Aspect | Standard |
|--------|----------|
| **Framework** | Vitest with React Testing Library |
| **Pattern** | Test behavior, not implementation — query by role, text, label |
| **Verify coverage** | `npx vitest run --coverage` |

**Scope:**

- **Component tests** — rendering, user interactions, state changes
- **Service/module tests** — API call logic, data transformation

**Do NOT test:** CSS styles, internal component state directly, implementation details

### TDD Approach

> 📝 **Red-Green-Refactor Cycle:**
>
> 1. **Write tests FIRST** — they must FAIL before implementation
> 2. **Implement the minimum code** to make tests pass
> 3. **Refactor** with tests green
> 4. **Never skip** the red-green-refactor cycle

---

## Git Practices

- Use conventional commits: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`
- Commit after each completed task or logical group
- Tests must pass before committing
- Keep commits atomic — one logical change per commit

---

> 💡 **How to use this file:** Copy the raw markdown version from `.github/copilot-instructions.md` into your project's `.github/copilot-instructions.md` before running any Spec Kit commands. This file is what tells Copilot how to behave — it defines the guardrails.

## Active Technologies
- In-memory Python `dict` (no database, no ORM) (001-create-todo)

## Recent Changes
- 001-create-todo: Added In-memory Python `dict` (no database, no ORM)
