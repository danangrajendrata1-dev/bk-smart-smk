from fastapi import APIRouter

from app.utils.response import success_response

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("")
def read_settings():
    return success_response("Settings berhasil diambil", {})
