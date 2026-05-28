from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.master_pelanggaran_schema import MasterPelanggaranCreate, MasterPelanggaranRead, MasterPelanggaranUpdate
from app.services.master_pelanggaran_service import create_data, delete_data, get_detail, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/master-pelanggaran", tags=["master_pelanggaran"])


@router.get("")
def list_master_pelanggaran(db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah"))):
    items = list_data(db)
    return success_response("Master pelanggaran berhasil diambil", [MasterPelanggaranRead.model_validate(item).model_dump() for item in items])


@router.get("/{item_id}")
def detail_master_pelanggaran(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah"))):
    item = get_detail(db, item_id)
    return success_response("Detail master pelanggaran berhasil diambil", MasterPelanggaranRead.model_validate(item).model_dump())


@router.post("")
def create_master_pelanggaran(payload: MasterPelanggaranCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload)
    return success_response("Master pelanggaran berhasil dibuat", MasterPelanggaranRead.model_validate(item).model_dump())


@router.put("/{item_id}")
def update_master_pelanggaran(item_id: str, payload: MasterPelanggaranUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = update_data(db, item_id, payload)
    return success_response("Master pelanggaran berhasil diubah", MasterPelanggaranRead.model_validate(item).model_dump())


@router.delete("/{item_id}")
def delete_master_pelanggaran(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    delete_data(db, item_id)
    return success_response("Master pelanggaran berhasil dinonaktifkan", {})
