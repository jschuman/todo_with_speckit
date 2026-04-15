# API Contract: To-Do Application

**Branch**: `001-create-todo` | **Date**: 2026-04-14
**Base URL**: `http://localhost:5000` (development)
**Content-Type**: `application/json` for all request and response bodies
**CORS**: Allowed origin `http://localhost:5173` (Vite dev server)

---

## Data Shapes

### TodoItem (all responses)

```json
{
  "id": "a4f8e2c1-4b3f-4d2e-8f1a-123456789abc",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-04-14T12:00:00.000Z"
}
```

| Field | Type | Nullable | Notes |
|---|---|---|---|
| `id` | `string` | No | UUID v4 |
| `title` | `string` | No | 1–200 chars |
| `description` | `string \| null` | Yes | Max 1000 chars; `null` when not set |
| `completed` | `boolean` | No | `false` = active, `true` = completed |
| `created_at` | `string` | No | ISO 8601 UTC |

### ErrorResponse

```json
{ "error": "Human-readable description of the problem" }
```

### DeleteResponse

```json
{ "message": "Deleted successfully" }
```

---

## Endpoints

---

### 1. List / Filter To-Do Items

**`GET /todos`**

Returns all to-do items, optionally filtered by status.

#### Query Parameters

| Parameter | Type | Required | Valid Values | Default |
|---|---|---|---|---|
| `status` | `string` | No | `all`, `active`, `completed` | `all` (returns everything) |

> Case-sensitive. `Active` or `ACTIVE` are invalid. Omitting `status` is equivalent to `?status=all`.

#### Success Response — `200 OK`

```json
[
  {
    "id": "a4f8e2c1-4b3f-4d2e-8f1a-123456789abc",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "completed": false,
    "created_at": "2026-04-14T12:00:00.000Z"
  },
  {
    "id": "b5a9d3e2-5c4f-4e3f-9f2b-234567890bcd",
    "title": "Read a book",
    "description": null,
    "completed": true,
    "created_at": "2026-04-14T12:05:00.000Z"
  }
]
```

Items are ordered by `created_at` ascending (oldest first). Returns `[]` when no items match.

#### Error Responses

| Status | Body | Condition |
|---|---|---|
| `422 Unprocessable Entity` | `{"error": "Invalid status value. Must be one of: all, active, completed"}` | `status` query param has an unrecognised value |

---

### 2. Create a To-Do Item

**`POST /todos`**

Creates a new to-do item with an active status.

#### Request Body

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `title` | `string` | Yes | Non-empty after strip; max 200 chars |
| `description` | `string \| null` | No | Max 1000 chars after strip; omit or send `null` |

#### Success Response — `201 Created`

Returns the newly created item.

```json
{
  "id": "a4f8e2c1-4b3f-4d2e-8f1a-123456789abc",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2026-04-14T12:00:00.000Z"
}
```

#### Error Responses

| Status | Body | Condition |
|---|---|---|
| `422 Unprocessable Entity` | `{"error": "Title is required"}` | `title` is absent, empty, or whitespace-only |
| `422 Unprocessable Entity` | `{"error": "Title must not exceed 200 characters"}` | `title` exceeds 200 chars after strip |
| `422 Unprocessable Entity` | `{"error": "Description must not exceed 1000 characters"}` | `description` exceeds 1000 chars after strip |

---

### 3. Toggle Completion Status

**`PATCH /todos/<id>/toggle`**

Flips the `completed` status of the item with the given `id`. No request body required.

#### Path Parameters

| Parameter | Type | Notes |
|---|---|---|
| `id` | `string` | UUID v4 of the to-do item to toggle |

#### Success Response — `200 OK`

Returns the updated item with the new `completed` value.

```json
{
  "id": "a4f8e2c1-4b3f-4d2e-8f1a-123456789abc",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2026-04-14T12:00:00.000Z"
}
```

#### Error Responses

| Status | Body | Condition |
|---|---|---|
| `404 Not Found` | `{"error": "Todo item not found"}` | No item with the given `id` exists |

---

### 4. Delete a To-Do Item

**`DELETE /todos/<id>`**

Permanently removes the item with the given `id`.

#### Path Parameters

| Parameter | Type | Notes |
|---|---|---|
| `id` | `string` | UUID v4 of the to-do item to delete |

#### Success Response — `200 OK`

```json
{ "message": "Deleted successfully" }
```

#### Error Responses

| Status | Body | Condition |
|---|---|---|
| `404 Not Found` | `{"error": "Todo item not found"}` | No item with the given `id` exists |

---

## Error Response Reference

| HTTP Status | When Used |
|---|---|
| `200 OK` | Successful GET (list/filter), PATCH (toggle), DELETE |
| `201 Created` | Successful POST (create) |
| `404 Not Found` | Item ID not found (toggle, delete) |
| `422 Unprocessable Entity` | Validation failure (blank title, too-long fields, invalid query param) |

---

## Complete Endpoint Summary

| Method | Path | Purpose | Success | Errors |
|---|---|---|---|---|
| `GET` | `/todos` | List all or filter by status | `200` | `422` |
| `POST` | `/todos` | Create new item | `201` | `422` |
| `PATCH` | `/todos/<id>/toggle` | Toggle completion status | `200` | `404` |
| `DELETE` | `/todos/<id>` | Delete item | `200` | `404` |
