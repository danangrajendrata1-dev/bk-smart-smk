from fastapi import APIRouter, Body

from app.utils.response import success_response

router = APIRouter(prefix="/presensi", tags=["presensi"])


@router.get("")
def list_presensi():
    return success_response("Data presensi berhasil diambil", [])


@router.post("")
def create_presensi(payload: dict = Body(default={})):
    return success_response("Data presensi berhasil dibuat", payload)
