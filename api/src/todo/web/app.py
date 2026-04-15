from __future__ import annotations

import os

from flask import Flask
from flask_cors import CORS

from todo.application.services import TodoService
from todo.infrastructure.in_memory_repository import InMemoryTodoRepository
from todo.web.routes import todos_bp


def create_app(repo: InMemoryTodoRepository | None = None) -> Flask:
    app = Flask(__name__)

    cors_origin = os.environ.get("CORS_ORIGIN", "http://localhost:5173")
    CORS(app, origins=[cors_origin])

    _repo = repo if repo is not None else InMemoryTodoRepository()
    service = TodoService(_repo)

    app.config["todo_service"] = service
    app.config["todo_repo"] = _repo

    app.register_blueprint(todos_bp)

    return app
