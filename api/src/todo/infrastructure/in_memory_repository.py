from __future__ import annotations

from todo.domain.entities import TodoItem


class InMemoryTodoRepository:
    def __init__(self) -> None:
        self._store: dict[str, TodoItem] = {}

    def get_all(self, completed: bool | None = None) -> list[TodoItem]:
        items = list(self._store.values())
        if completed is not None:
            items = [i for i in items if i.completed == completed]
        return sorted(items, key=lambda i: i.created_at)

    def get_by_id(self, id: str) -> TodoItem | None:
        return self._store.get(id)

    def add(self, item: TodoItem) -> TodoItem:
        self._store[item.id] = item
        return item

    def update(self, item: TodoItem) -> TodoItem:
        self._store[item.id] = item
        return item

    def delete(self, id: str) -> bool:
        if id in self._store:
            del self._store[id]
            return True
        return False
