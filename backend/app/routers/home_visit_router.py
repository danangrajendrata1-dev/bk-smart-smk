from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.home_visit_schema import HomeVisitCreate, HomeVisitDetailResponse, HomeVisitResponse, HomeVisitUpdate
from app.services.home_visit_service import create_data, delete_data, get_by_siswa, get_detail, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/home-visit", tags=["home_visit"])


@router.get("")
def list_home_visit(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah")),
):
    items = list_data(db, {"tanggal_awal": tanggal_awal, "tanggal_akhir": tanggal_akhir, "siswa_id": siswa_id, "kelas_id": kelas_id, "status": status}, current_user)
    return success_response("Home visit berhasil diambil", items)


@router.get("/{item_id}")
def detail_home_visit(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    item = get_detail(db, item_id, current_user)
    return success_response("Detail home visit berhasil diambil", item)


@router.post("")
def create_home_visit(payload: HomeVisitCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload, current_user)
    return success_response("Home visit berhasil dibuat", item)


@router.put("/{item_id}")
def update_home_visit(item_id: str, payload: HomeVisitUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = update_data(db, item_id, payload, current_user)
    return success_response("Home visit berhasil diubah", item)


@router.delete("/{item_id}")
def delete_home_visit(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    delete_data(db, item_id)
    return success_response("Home visit berhasil dihapus", {})


@router.get("/siswa/{siswa_id}")
def home_visit_by_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = get_by_siswa(db, siswa_id, current_user)
    return success_response("Home visit per siswa berhasil diambil", items)
