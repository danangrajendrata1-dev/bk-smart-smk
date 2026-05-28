from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.konseling_schema import KonselingCreate, KonselingDetailResponse, KonselingResponse, KonselingUpdate
from app.services.konseling_service import create_data, delete_data, get_by_siswa, get_detail, get_jadwal_hari_ini, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/konseling", tags=["konseling"])


@router.get("/jadwal/hari-ini")
def jadwal_hari_ini(db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = get_jadwal_hari_ini(db, current_user)
    return success_response("Jadwal konseling hari ini berhasil diambil", items)


@router.get("/siswa/{siswa_id}")
def konseling_by_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = get_by_siswa(db, siswa_id, current_user)
    return success_response("Data konseling siswa berhasil diambil", items)


@router.get("")
def list_konseling(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    jenis_konseling: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah")),
):
    items = list_data(
        db,
        current_user,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "siswa_id": siswa_id,
            "kelas_id": kelas_id,
            "jenis_konseling": jenis_konseling,
            "status": status,
        },
    )
    return success_response("Data konseling berhasil diambil", items)


@router.get("/{konseling_id}")
def detail_konseling(konseling_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    item = get_detail(db, konseling_id, current_user)
    return success_response("Detail konseling berhasil diambil", item)


@router.post("")
def create_konseling(payload: KonselingCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload, current_user)
    return success_response("Data konseling berhasil dibuat", item)


@router.put("/{konseling_id}")
def update_konseling(konseling_id: str, payload: KonselingUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = update_data(db, konseling_id, payload, current_user)
    return success_response("Data konseling berhasil diubah", item)


@router.delete("/{konseling_id}")
def delete_konseling(konseling_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    delete_data(db, konseling_id)
    return success_response("Data konseling berhasil dihapus", {})
