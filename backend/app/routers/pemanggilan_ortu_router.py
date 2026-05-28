from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.pemanggilan_ortu_schema import PemanggilanOrtuCreate, PemanggilanOrtuDetailResponse, PemanggilanOrtuResponse, PemanggilanOrtuUpdate
from app.services.pemanggilan_ortu_service import create_data, delete_data, get_by_siswa, get_detail, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/pemanggilan-ortu", tags=["pemanggilan_ortu"])


@router.get("")
def list_pemanggilan_ortu(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah")),
):
    items = list_data(db, {"tanggal_awal": tanggal_awal, "tanggal_akhir": tanggal_akhir, "siswa_id": siswa_id, "kelas_id": kelas_id, "status": status}, current_user)
    return success_response("Pemanggilan orang tua berhasil diambil", items)


@router.get("/{item_id}")
def detail_pemanggilan_ortu(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    item = get_detail(db, item_id, current_user)
    return success_response("Detail pemanggilan orang tua berhasil diambil", item)


@router.post("")
def create_pemanggilan_ortu(payload: PemanggilanOrtuCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload, current_user)
    return success_response("Pemanggilan orang tua berhasil dibuat", item)


@router.put("/{item_id}")
def update_pemanggilan_ortu(item_id: str, payload: PemanggilanOrtuUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = update_data(db, item_id, payload, current_user)
    return success_response("Pemanggilan orang tua berhasil diubah", item)


@router.delete("/{item_id}")
def delete_pemanggilan_ortu(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    delete_data(db, item_id)
    return success_response("Pemanggilan orang tua berhasil dihapus", {})


@router.get("/siswa/{siswa_id}")
def pemanggilan_ortu_by_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = get_by_siswa(db, siswa_id, current_user)
    return success_response("Pemanggilan orang tua per siswa berhasil diambil", items)
