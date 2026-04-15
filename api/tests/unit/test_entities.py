"""Unit tests for TodoItem entity — US1 (T016) + US3 (T040)."""
from __future__ import annotations

import pytest

from todo.domain.entities import TodoItem


class TestTodoItemCreate:
    def test_create_sets_uuid_id(self) -> None:
        item = TodoItem.create("Buy milk")
        assert len(item.id) == 36
        assert item.id.count("-") == 4

    def test_create_sets_title(self) -> None:
        item = TodoItem.create("Buy milk")
        assert item.title == "Buy milk"

    def test_create_strips_title_whitespace(self) -> None:
        item = TodoItem.create("  Buy milk  ")
        assert item.title == "Buy milk"

    def test_create_sets_completed_false(self) -> None:
        item = TodoItem.create("Buy milk")
        assert item.completed is False

    def test_create_sets_created_at_iso8601_utc(self) -> None:
        item = TodoItem.create("Buy milk")
        assert item.created_at.endswith("Z")
        assert "T" in item.created_at

    def test_create_without_description_sets_none(self) -> None:
        item = TodoItem.create("Buy milk")
        assert item.description is None

    def test_create_with_description(self) -> None:
        item = TodoItem.create("Buy milk", description="Whole milk")
        assert item.description == "Whole milk"

    def test_create_strips_description_whitespace(self) -> None:
        item = TodoItem.create("Buy milk", description="  Whole milk  ")
        assert item.description == "Whole milk"

    def test_two_creates_have_different_ids(self) -> None:
        a = TodoItem.create("Task A")
        b = TodoItem.create("Task B")
        assert a.id != b.id


class TestTodoItemToggle:
    def test_toggle_active_to_completed(self) -> None:
        item = TodoItem.create("Task")
        toggled = item.toggle()
        assert toggled.completed is True

    def test_toggle_completed_to_active(self) -> None:
        item = TodoItem.create("Task")
        completed = item.toggle()
        active_again = completed.toggle()
        assert active_again.completed is False

    def test_toggle_preserves_id(self) -> None:
        item = TodoItem.create("Task")
        assert item.toggle().id == item.id

    def test_toggle_preserves_title(self) -> None:
        item = TodoItem.create("Task")
        assert item.toggle().title == item.title

    def test_toggle_preserves_description(self) -> None:
        item = TodoItem.create("Task", description="Details")
        assert item.toggle().description == "Details"

    def test_toggle_preserves_created_at(self) -> None:
        item = TodoItem.create("Task")
        assert item.toggle().created_at == item.created_at

    def test_toggle_does_not_mutate_original(self) -> None:
        item = TodoItem.create("Task")
        item.toggle()
        assert item.completed is False
