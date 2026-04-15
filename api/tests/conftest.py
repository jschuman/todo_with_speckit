from __future__ import annotations

import pytest
from flask import Flask
from flask.testing import FlaskClient

from todo.infrastructure.in_memory_repository import InMemoryTodoRepository
from todo.web.app import create_app


@pytest.fixture()
def todo_repo() -> InMemoryTodoRepository:
    """Provides a fresh in-memory repository for direct test seeding."""
    return InMemoryTodoRepository()


@pytest.fixture()
def app(todo_repo: InMemoryTodoRepository) -> Flask:
    """Creates a Flask test application with an isolated repository."""
    flask_app = create_app(repo=todo_repo)
    flask_app.config["TESTING"] = True
    return flask_app


@pytest.fixture()
def client(app: Flask) -> FlaskClient:
    """Provides a Flask test client."""
    return app.test_client()
