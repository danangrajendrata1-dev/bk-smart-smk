from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.daftar_hadir_konseling_schema import (
    DaftarHadirKonselingCreate,
    DaftarHadirKonselingResponse,
    DaftarHadirKonselingUpdate,
)
from app.services.daftar_hadir_konseling_service import create_data, delete_data, get_by_konseling, get_by_siswa, get_detail, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/daftar-hadir-konseling", tags=["daftar_hadir_konseling"])


@router.get("")
def list_daftar_hadir_konseling(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    konseling_id: str | None = Query(default=None),
    status_hadir: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah")),
):
    items = list_data(
        db,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "siswa_id": siswa_id,
            "konseling_id": konseling_id,
            "status_hadir": status_hadir,
        },
        current_user,
    )
    return success_response("Daftar hadir konseling berhasil diambil", items)


@router.post("")
def create_daftar_hadir_konseling(payload: DaftarHadirKonselingCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload, current_user)
    return success_response("Daftar hadir konseling berhasil dibuat", item)


@router.put("/{item_id}")
def update_daftar_hadir_konseling(item_id: str, payload: DaftarHadirKonselingUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = update_data(db, item_id, payload, current_user)
    return success_response("Daftar hadir konseling berhasil diubah", item)


@router.delete("/{item_id}")
def delete_daftar_hadir_konseling(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    delete_data(db, item_id)
    return success_response("Daftar hadir konseling berhasil dihapus", {})


@router.get("/konseling/{konseling_id}")
def daftar_hadir_by_konseling(konseling_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = get_by_konseling(db, konseling_id, current_user)
    return success_response("Daftar hadir konseling per konseling berhasil diambil", items)


@router.get("/siswa/{siswa_id}")
def daftar_hadir_by_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = get_by_siswa(db, siswa_id, current_user)
    return success_response("Daftar hadir konseling per siswa berhasil diambil", items)


@router.get("/{item_id}")
def detail_daftar_hadir_konseling(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    item = get_detail(db, item_id, current_user)
    return success_response("Detail daftar hadir konseling berhasil diambil", item)
