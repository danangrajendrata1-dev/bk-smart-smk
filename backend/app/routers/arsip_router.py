from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.arsip_schema import ArsipCreate, ArsipResponse
from app.services.arsip_service import create_data, get_detail, list_data
from app.utils.response import success_response

router = APIRouter(prefix="/arsip", tags=["arsip"])


@router.get("")
def list_arsip(
    siswa_id: str | None = Query(default=None),
    jenis_dokumen: str | None = Query(default=None),
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas")),
):
    items = list_data(db, {
        "siswa_id": siswa_id,
        "jenis_dokumen": jenis_dokumen,
        "tanggal_awal": tanggal_awal,
        "tanggal_akhir": tanggal_akhir,
    })
    return success_response("Arsip dokumen berhasil diambil", [ArsipResponse.model_validate(item).model_dump() for item in items])


@router.get("/siswa/{siswa_id}")
def arsip_by_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas"))):
    items = list_data(db, {"siswa_id": siswa_id})
    return success_response("Arsip siswa berhasil diambil", [ArsipResponse.model_validate(item).model_dump() for item in items])


@router.get("/jenis/{jenis_dokumen}")
def arsip_by_jenis(jenis_dokumen: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas"))):
    items = list_data(db, {"jenis_dokumen": jenis_dokumen})
    return success_response("Arsip berdasarkan jenis dokumen berhasil diambil", [ArsipResponse.model_validate(item).model_dump() for item in items])


@router.post("")
def create_arsip(payload: ArsipCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk"))):
    item = create_data(db, payload, current_user.id)
    return success_response("Arsip dokumen berhasil dibuat", ArsipResponse.model_validate(item).model_dump())


@router.get("/{item_id}")
def detail_arsip(item_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas"))):
    item = get_detail(db, item_id)
    return success_response("Detail arsip berhasil diambil", ArsipResponse.model_validate(item).model_dump())
