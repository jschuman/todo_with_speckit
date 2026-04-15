from __future__ import annotations

import dataclasses

from flask import Blueprint, current_app, jsonify, request

todos_bp = Blueprint("todos", __name__, url_prefix="/todos")


def _service():
    return current_app.config["todo_service"]


@todos_bp.get("")
def list_todos():
    status = request.args.get("status", "all")
    try:
        items = _service().list_todos(status=status)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 422
    return jsonify([dataclasses.asdict(i) for i in items]), 200


@todos_bp.post("")
def create_todo():
    from todo.application.dtos import CreateTodoRequest

    body = request.get_json(silent=True) or {}
    dto = CreateTodoRequest(
        title=body.get("title", ""),
        description=body.get("description") or None,
    )
    try:
        item = _service().create_todo(dto)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 422
    return jsonify(dataclasses.asdict(item)), 201


@todos_bp.patch("/<string:id>/toggle")
def toggle_todo(id: str):
    try:
        item = _service().toggle_todo(id)
    except KeyError:
        return jsonify({"error": "Todo item not found"}), 404
    return jsonify(dataclasses.asdict(item)), 200


@todos_bp.delete("/<string:id>")
def delete_todo(id: str):
    try:
        _service().delete_todo(id)
    except KeyError:
        return jsonify({"error": "Todo item not found"}), 404
    return jsonify({"message": "Deleted successfully"}), 200
