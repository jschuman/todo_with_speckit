from __future__ import annotations

from todo.application.dtos import CreateTodoRequest
from todo.domain.entities import TodoItem
from todo.domain.interfaces import ITodoRepository


class TodoService:
    def __init__(self, repo: ITodoRepository) -> None:
        self._repo = repo

    _VALID_STATUSES = frozenset({"all", "active", "completed"})

    def list_todos(self, status: str = "all") -> list[TodoItem]:
        if status not in self._VALID_STATUSES:
            raise ValueError(f"Invalid status value. Must be one of: all, active, completed")
        completed_filter: bool | None = None
        if status == "active":
            completed_filter = False
        elif status == "completed":
            completed_filter = True
        return self._repo.get_all(completed=completed_filter)

    def create_todo(self, request: CreateTodoRequest) -> TodoItem:
        title = request.title.strip() if request.title else ""
        if not title:
            raise ValueError("Title is required")
        if len(title) > 200:
            raise ValueError("Title must not exceed 200 characters")
        if request.description is not None and len(request.description) > 1000:
            raise ValueError("Description must not exceed 1000 characters")
        item = TodoItem.create(title=title, description=request.description)
        return self._repo.add(item)

    def toggle_todo(self, id: str) -> TodoItem:
        item = self._repo.get_by_id(id)
        if item is None:
            raise KeyError(id)
        toggled = item.toggle()
        return self._repo.update(toggled)

    def delete_todo(self, id: str) -> None:
        if not self._repo.delete(id):
            raise KeyError(id)
