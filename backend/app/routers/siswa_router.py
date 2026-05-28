from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.siswa_schema import SiswaCreate, SiswaProfileRead, SiswaRead, SiswaUpdate
from app.services.siswa_service import create_data, delete_data, get_detail, get_profile, get_rekomendasi_sp_siswa, get_status_pembinaan, get_total_poin, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/siswa", tags=["siswa"])


@router.get("")
def list_siswa(
    search: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    status_siswa: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah")),
):
    items = list_data(db, search=search, kelas_id=kelas_id, status_siswa=status_siswa)
    return success_response("Data siswa berhasil diambil", [SiswaRead.model_validate(item).model_dump() for item in items])


@router.post("")
def create_siswa(payload: SiswaCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload)
    return success_response("Data siswa berhasil dibuat", SiswaRead.model_validate(item).model_dump())


@router.get("/{siswa_id}")
def detail_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    item = get_detail(db, siswa_id)
    return success_response("Detail siswa berhasil diambil", SiswaRead.model_validate(item).model_dump())


@router.put("/{siswa_id}")
def update_siswa(siswa_id: str, payload: SiswaUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = update_data(db, siswa_id, payload)
    return success_response("Data siswa berhasil diubah", SiswaRead.model_validate(item).model_dump())


@router.delete("/{siswa_id}")
def delete_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    delete_data(db, siswa_id)
    return success_response("Status siswa berhasil dinonaktifkan", {})


@router.get("/{siswa_id}/profile")
def profile_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    item = get_profile(db, siswa_id)
    return success_response("Profile siswa berhasil diambil", item.model_dump())


@router.get("/{siswa_id}/total-poin")
def total_poin_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    return success_response("Total poin siswa berhasil diambil", {"siswa_id": siswa_id, "total_poin": get_total_poin(db, siswa_id)})


@router.get("/{siswa_id}/status-pembinaan")
def status_pembinaan_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    return success_response("Status pembinaan siswa berhasil diambil", {"siswa_id": siswa_id, "status_pembinaan": get_status_pembinaan(db, siswa_id)})


@router.get("/{siswa_id}/rekomendasi-sp")
def rekomendasi_sp_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    return success_response("Rekomendasi SP siswa berhasil diambil", {"siswa_id": siswa_id, "rekomendasi_sp": get_rekomendasi_sp_siswa(db, siswa_id)})
