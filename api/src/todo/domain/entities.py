from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
import uuid


@dataclass
class TodoItem:
    id: str
    title: str
    completed: bool
    created_at: str
    description: str | None = None

    @staticmethod
    def create(title: str, description: str | None = None) -> "TodoItem":
        return TodoItem(
            id=str(uuid.uuid4()),
            title=title.strip(),
            description=description.strip() if description else None,
            completed=False,
            created_at=datetime.now(timezone.utc)
            .isoformat(timespec="milliseconds")
            .replace("+00:00", "Z"),
        )

    def toggle(self) -> "TodoItem":
        from dataclasses import replace

        return replace(self, completed=not self.completed)
