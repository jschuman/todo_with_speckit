"""Unit tests for TodoService — US1 (T017), US2 (T031), US3 (T041), US4 (T051), US5 (T061)."""
from __future__ import annotations

from unittest.mock import MagicMock

import pytest

from todo.application.dtos import CreateTodoRequest
from todo.application.services import TodoService
from todo.domain.entities import TodoItem


def _make_item(
    title: str = "Test Task",
    completed: bool = False,
    description: str | None = None,
) -> TodoItem:
    return TodoItem(
        id="test-uuid",
        title=title,
        completed=completed,
        created_at="2026-04-14T12:00:00.000Z",
        description=description,
    )


# ─── US1: list_todos ──────────────────────────────────────────────────────────


class TestListTodosUS1:
    def test_returns_all_items(self) -> None:
        repo = MagicMock()
        items = [_make_item("A"), _make_item("B")]
        repo.get_all.return_value = items
        service = TodoService(repo)
        result = service.list_todos()
        assert result == items
        repo.get_all.assert_called_once_with(completed=None)

    def test_returns_empty_list(self) -> None:
        repo = MagicMock()
        repo.get_all.return_value = []
        service = TodoService(repo)
        assert service.list_todos() == []


# ─── US2: create_todo ─────────────────────────────────────────────────────────


class TestCreateTodoUS2:
    def test_creates_item_with_valid_title(self) -> None:
        repo = MagicMock()
        item = _make_item("Buy milk")
        repo.add.return_value = item
        service = TodoService(repo)
        result = service.create_todo(CreateTodoRequest(title="Buy milk"))
        assert result == item
        repo.add.assert_called_once()

    def test_raises_for_blank_title(self) -> None:
        repo = MagicMock()
        service = TodoService(repo)
        with pytest.raises(ValueError, match="Title is required"):
            service.create_todo(CreateTodoRequest(title=""))

    def test_raises_for_whitespace_only_title(self) -> None:
        repo = MagicMock()
        service = TodoService(repo)
        with pytest.raises(ValueError, match="Title is required"):
            service.create_todo(CreateTodoRequest(title="   "))

    def test_raises_for_title_exceeding_200_chars(self) -> None:
        repo = MagicMock()
        service = TodoService(repo)
        with pytest.raises(ValueError, match="200 characters"):
            service.create_todo(CreateTodoRequest(title="x" * 201))

    def test_raises_for_description_exceeding_1000_chars(self) -> None:
        repo = MagicMock()
        service = TodoService(repo)
        with pytest.raises(ValueError, match="1000 characters"):
            service.create_todo(
                CreateTodoRequest(title="Valid", description="x" * 1001)
            )

    def test_creates_item_without_description(self) -> None:
        repo = MagicMock()
        repo.add.return_value = _make_item()
        service = TodoService(repo)
        service.create_todo(CreateTodoRequest(title="Task"))
        call_args = repo.add.call_args[0][0]
        assert call_args.description is None

    def test_creates_item_with_description(self) -> None:
        repo = MagicMock()
        repo.add.return_value = _make_item(description="Details")
        service = TodoService(repo)
        service.create_todo(CreateTodoRequest(title="Task", description="Details"))
        call_args = repo.add.call_args[0][0]
        assert call_args.description == "Details"


# ─── US3: toggle_todo ─────────────────────────────────────────────────────────


class TestToggleTodoUS3:
    def test_toggles_existing_item(self) -> None:
        repo = MagicMock()
        original = _make_item(completed=False)
        toggled = _make_item(completed=True)
        repo.get_by_id.return_value = original
        repo.update.return_value = toggled
        service = TodoService(repo)
        result = service.toggle_todo("test-uuid")
        assert result.completed is True

    def test_raises_key_error_for_unknown_id(self) -> None:
        repo = MagicMock()
        repo.get_by_id.return_value = None
        service = TodoService(repo)
        with pytest.raises(KeyError):
            service.toggle_todo("nonexistent")


# ─── US4: delete_todo ─────────────────────────────────────────────────────────


class TestDeleteTodoUS4:
    def test_deletes_existing_item(self) -> None:
        repo = MagicMock()
        repo.delete.return_value = True
        service = TodoService(repo)
        service.delete_todo("test-uuid")  # should not raise
        repo.delete.assert_called_once_with("test-uuid")

    def test_raises_key_error_for_unknown_id(self) -> None:
        repo = MagicMock()
        repo.delete.return_value = False
        service = TodoService(repo)
        with pytest.raises(KeyError):
            service.delete_todo("nonexistent")


# ─── US5: list_todos with status filter ───────────────────────────────────────


class TestListTodosWithStatusUS5:
    def test_all_returns_all_items(self) -> None:
        repo = MagicMock()
        repo.get_all.return_value = [_make_item()]
        service = TodoService(repo)
        service.list_todos(status="all")
        repo.get_all.assert_called_once_with(completed=None)

    def test_active_filters_to_incomplete(self) -> None:
        repo = MagicMock()
        repo.get_all.return_value = []
        service = TodoService(repo)
        service.list_todos(status="active")
        repo.get_all.assert_called_once_with(completed=False)

    def test_completed_filters_to_done(self) -> None:
        repo = MagicMock()
        repo.get_all.return_value = []
        service = TodoService(repo)
        service.list_todos(status="completed")
        repo.get_all.assert_called_once_with(completed=True)

    def test_invalid_status_raises_value_error(self) -> None:
        repo = MagicMock()
        service = TodoService(repo)
        with pytest.raises(ValueError, match="Invalid status"):
            service.list_todos(status="unknown")
