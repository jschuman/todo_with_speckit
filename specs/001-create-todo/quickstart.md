# Quickstart: To-Do Application

**Branch**: `001-create-todo` | **Date**: 2026-04-14

---

## Prerequisites

| Tool | Version | Check |
|---|---|---|
| Python | 3.11+ | `python --version` |
| pip / uv | any | `pip --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

---

## Project Structure

```text
todo-app/
├── api/                    # Python Flask backend
│   ├── pyproject.toml
│   ├── src/
│   │   └── todo/
│   │       ├── domain/
│   │       ├── application/
│   │       ├── infrastructure/
│   │       └── web/
│   └── tests/
│       ├── conftest.py
│       ├── unit/
│       └── integration/
└── web/                    # React + TypeScript frontend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── types/
        ├── services/
        ├── hooks/
        ├── components/
        ├── App.tsx
        └── main.tsx
```

---

## Backend Setup & Run

```bash
cd api

# Install dependencies
pip install -e ".[dev]"

# Run the development server (default: http://localhost:5000)
flask --app src/todo/web/app run --debug
```

The backend will be available at `http://localhost:5000`.

---

## Frontend Setup & Run

```bash
cd web

# Install dependencies
npm install

# Run the Vite dev server (default: http://localhost:5173)
npm run dev
```

The frontend will be available at `http://localhost:5173`.

---

## Running Tests

### Backend (from `api/`)

```bash
# Run all tests
pytest

# Run with coverage report
pytest --cov=src/todo --cov-report=term-missing

# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/integration/
```

Coverage threshold: **80% minimum** (enforced via `pyproject.toml` coverage config).

### Frontend (from `web/`)

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

Coverage threshold: **80% minimum** (enforced via `vite.config.ts` coverage config).

---

## API Smoke Test

With the backend running, verify endpoints with curl:

```bash
# List all todos (empty)
curl http://localhost:5000/todos

# Create a todo
curl -X POST http://localhost:5000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk and eggs"}'

# Toggle completion (replace <id> with actual UUID)
curl -X PATCH http://localhost:5000/todos/<id>/toggle

# Filter active items
curl "http://localhost:5000/todos?status=active"

# Delete a todo (replace <id> with actual UUID)
curl -X DELETE http://localhost:5000/todos/<id>
```

---

## Environment Variables

### Backend (`api/`)

| Variable | Default | Purpose |
|---|---|---|
| `FLASK_ENV` | `development` | Flask environment |
| `FLASK_RUN_PORT` | `5000` | Port for Flask dev server |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

### Frontend (`web/`)

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000` | Backend API base URL |

Create `web/.env.local` to override:
```
VITE_API_BASE_URL=http://localhost:5000
```
