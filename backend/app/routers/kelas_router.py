from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.kelas_schema import KelasCreate, KelasRead, KelasUpdate
from app.services.kelas_service import create_data, delete_data, get_detail, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/kelas", tags=["kelas"])


@router.get("")
def list_kelas(db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = list_data(db)
    return success_response("Data kelas berhasil diambil", [KelasRead.model_validate(item).model_dump() for item in items])


@router.post("")
def create_kelas(payload: KelasCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload)
    return success_response("Data kelas berhasil dibuat", KelasRead.model_validate(item).model_dump())


@router.get("/{kelas_id}")
def detail_kelas(kelas_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    item = get_detail(db, kelas_id)
    return success_response("Detail kelas berhasil diambil", KelasRead.model_validate(item).model_dump())


@router.put("/{kelas_id}")
def update_kelas(kelas_id: str, payload: KelasUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = update_data(db, kelas_id, payload)
    return success_response("Data kelas berhasil diubah", KelasRead.model_validate(item).model_dump())


@router.delete("/{kelas_id}")
def delete_kelas(kelas_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    delete_data(db, kelas_id)
    return success_response("Status kelas berhasil dinonaktifkan", {})
