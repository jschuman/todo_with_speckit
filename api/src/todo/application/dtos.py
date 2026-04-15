from __future__ import annotations

from dataclasses import dataclass


@dataclass
class CreateTodoRequest:
    title: str
    description: str | None = None
