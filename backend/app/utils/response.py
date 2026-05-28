from typing import Any, Optional


def success_response(message: str, data: Optional[Any] = None) -> dict:
    return {
        "status": "success",
        "message": message,
        "data": data if data is not None else {},
    }


def error_response(message: str, detail: Optional[Any] = None) -> dict:
    return {
        "status": "error",
        "message": message,
        "detail": detail if detail is not None else {},
    }
