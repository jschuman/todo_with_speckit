"""Integration tests — all US stories against the full HTTP stack."""
from __future__ import annotations

import pytest
from flask.testing import FlaskClient

from todo.domain.entities import TodoItem
from todo.infrastructure.in_memory_repository import InMemoryTodoRepository


def _seed(repo: InMemoryTodoRepository, title: str, completed: bool = False) -> TodoItem:
    """Helper: create a TodoItem and add it directly to the repository."""
    item = TodoItem.create(title)
    # bypass NotImplementedError — will be real after T022/T023
    repo._store[item.id] = item
    if completed:
        toggled = item.toggle()
        repo._store[toggled.id] = toggled
        return toggled
    return item


# ─── US1: GET /todos ──────────────────────────────────────────────────────────


class TestGetTodosUS1:
    def test_returns_empty_list_when_no_items(self, client: FlaskClient) -> None:
        response = client.get("/todos")
        assert response.status_code == 200
        assert response.get_json() == []

    def test_returns_all_items_with_correct_shape(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        item = _seed(todo_repo, "Buy milk")
        response = client.get("/todos")
        assert response.status_code == 200
        data = response.get_json()
        assert len(data) == 1
        assert data[0]["id"] == item.id
        assert data[0]["title"] == "Buy milk"
        assert data[0]["completed"] is False
        assert data[0]["description"] is None
        assert "created_at" in data[0]

    def test_returns_multiple_items(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        _seed(todo_repo, "Task A")
        _seed(todo_repo, "Task B")
        response = client.get("/todos")
        assert response.status_code == 200
        assert len(response.get_json()) == 2


# ─── US2: POST /todos ─────────────────────────────────────────────────────────


class TestCreateTodoUS2:
    def test_creates_item_and_returns_201(self, client: FlaskClient) -> None:
        response = client.post("/todos", json={"title": "Buy milk"})
        assert response.status_code == 201
        data = response.get_json()
        assert data["title"] == "Buy milk"
        assert data["completed"] is False
        assert data["description"] is None
        assert "id" in data
        assert "created_at" in data

    def test_creates_item_with_description(self, client: FlaskClient) -> None:
        response = client.post(
            "/todos", json={"title": "Buy milk", "description": "Whole milk"}
        )
        assert response.status_code == 201
        assert response.get_json()["description"] == "Whole milk"

    def test_creates_item_without_description(self, client: FlaskClient) -> None:
        response = client.post("/todos", json={"title": "Task"})
        assert response.status_code == 201
        assert response.get_json()["description"] is None

    def test_rejects_blank_title(self, client: FlaskClient) -> None:
        response = client.post("/todos", json={"title": ""})
        assert response.status_code == 422
        assert response.get_json()["error"] == "Title is required"

    def test_rejects_whitespace_only_title(self, client: FlaskClient) -> None:
        response = client.post("/todos", json={"title": "   "})
        assert response.status_code == 422
        assert response.get_json()["error"] == "Title is required"

    def test_rejects_title_exceeding_200_chars(self, client: FlaskClient) -> None:
        response = client.post("/todos", json={"title": "x" * 201})
        assert response.status_code == 422
        assert "200 characters" in response.get_json()["error"]

    def test_item_appears_in_subsequent_get(self, client: FlaskClient) -> None:
        client.post("/todos", json={"title": "New task"})
        resp = client.get("/todos")
        assert any(t["title"] == "New task" for t in resp.get_json())


# ─── US3: PATCH /todos/<id>/toggle ───────────────────────────────────────────


class TestToggleTodoUS3:
    def test_toggles_active_to_completed(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        item = _seed(todo_repo, "Task")
        response = client.patch(f"/todos/{item.id}/toggle")
        assert response.status_code == 200
        assert response.get_json()["completed"] is True

    def test_toggles_completed_to_active(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        item = _seed(todo_repo, "Task")
        client.patch(f"/todos/{item.id}/toggle")
        response = client.patch(f"/todos/{item.id}/toggle")
        assert response.status_code == 200
        assert response.get_json()["completed"] is False

    def test_returns_404_for_unknown_id(self, client: FlaskClient) -> None:
        response = client.patch("/todos/nonexistent-id/toggle")
        assert response.status_code == 404
        assert response.get_json()["error"] == "Todo item not found"


# ─── US4: DELETE /todos/<id> ─────────────────────────────────────────────────


class TestDeleteTodoUS4:
    def test_deletes_item_and_returns_200(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        item = _seed(todo_repo, "Task")
        response = client.delete(f"/todos/{item.id}")
        assert response.status_code == 200
        assert response.get_json()["message"] == "Deleted successfully"

    def test_deleted_item_absent_from_subsequent_get(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        item = _seed(todo_repo, "Task")
        client.delete(f"/todos/{item.id}")
        resp = client.get("/todos")
        assert all(t["id"] != item.id for t in resp.get_json())

    def test_returns_404_for_unknown_id(self, client: FlaskClient) -> None:
        response = client.delete("/todos/nonexistent-id")
        assert response.status_code == 404
        assert response.get_json()["error"] == "Todo item not found"

    def test_multi_operation_sequence(
        self, client: FlaskClient
    ) -> None:
        """SC-006: list reflects state after add, toggle, delete combo."""
        r1 = client.post("/todos", json={"title": "Keep"})
        r2 = client.post("/todos", json={"title": "Delete me"})
        keep_id = r1.get_json()["id"]
        delete_id = r2.get_json()["id"]
        client.patch(f"/todos/{keep_id}/toggle")
        client.delete(f"/todos/{delete_id}")
        resp = client.get("/todos")
        items = resp.get_json()
        ids = [t["id"] for t in items]
        assert keep_id in ids
        assert delete_id not in ids
        kept = next(t for t in items if t["id"] == keep_id)
        assert kept["completed"] is True


# ─── US5: GET /todos?status= ─────────────────────────────────────────────────


class TestFilterTodosUS5:
    def test_active_filter_returns_only_active(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        active = _seed(todo_repo, "Active task", completed=False)
        _seed(todo_repo, "Done task", completed=True)
        resp = client.get("/todos?status=active")
        assert resp.status_code == 200
        data = resp.get_json()
        assert len(data) == 1
        assert data[0]["id"] == active.id

    def test_completed_filter_returns_only_completed(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        _seed(todo_repo, "Active task", completed=False)
        done = _seed(todo_repo, "Done task", completed=True)
        resp = client.get("/todos?status=completed")
        assert resp.status_code == 200
        data = resp.get_json()
        assert len(data) == 1
        assert data[0]["id"] == done.id

    def test_all_filter_returns_everything(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        _seed(todo_repo, "Active task")
        _seed(todo_repo, "Done task", completed=True)
        resp = client.get("/todos?status=all")
        assert resp.status_code == 200
        assert len(resp.get_json()) == 2

    def test_no_param_returns_all(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        _seed(todo_repo, "Task A")
        _seed(todo_repo, "Task B", completed=True)
        resp = client.get("/todos")
        assert resp.status_code == 200
        assert len(resp.get_json()) == 2

    def test_invalid_status_returns_422(self, client: FlaskClient) -> None:
        resp = client.get("/todos?status=invalid")
        assert resp.status_code == 422
        assert "Invalid status" in resp.get_json()["error"]

    def test_empty_list_when_no_matches(
        self, client: FlaskClient, todo_repo: InMemoryTodoRepository
    ) -> None:
        _seed(todo_repo, "Active task", completed=False)
        resp = client.get("/todos?status=completed")
        assert resp.status_code == 200
        assert resp.get_json() == []
