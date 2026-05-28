from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.pelanggaran_schema import PelanggaranCreate, PelanggaranRead, PelanggaranUpdate
from app.services.pelanggaran_service import create_data, delete_data, get_by_siswa, get_detail, get_rekomendasi_sp, get_status_pembinaan, get_total_poin_siswa, list_data, update_data
from app.utils.response import success_response

router = APIRouter(prefix="/pelanggaran", tags=["pelanggaran"])


@router.get("")
def list_pelanggaran(db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas"))):
    items = list_data(db)
    return success_response("Data pelanggaran berhasil diambil", [PelanggaranRead.model_validate(item).model_dump() for item in items])


@router.post("")
def create_pelanggaran(payload: PelanggaranCreate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan"))):
    item = create_data(db, payload, current_user)
    total_poin = get_total_poin_siswa(db, item.siswa_id)
    return success_response(
        "Data pelanggaran berhasil dibuat",
        {
            "pelanggaran": PelanggaranRead.model_validate(item).model_dump(),
            "total_poin": total_poin,
            "status_pembinaan": get_status_pembinaan(total_poin),
            "rekomendasi_sp": get_rekomendasi_sp(total_poin),
        },
    )


@router.put("/{pelanggaran_id}")
def update_pelanggaran(pelanggaran_id: str, payload: PelanggaranUpdate, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan"))):
    item = update_data(db, pelanggaran_id, payload)
    total_poin = get_total_poin_siswa(db, item.siswa_id)
    return success_response(
        "Data pelanggaran berhasil diubah",
        {
            "pelanggaran": PelanggaranRead.model_validate(item).model_dump(),
            "total_poin": total_poin,
            "status_pembinaan": get_status_pembinaan(total_poin),
            "rekomendasi_sp": get_rekomendasi_sp(total_poin),
        },
    )


@router.delete("/{pelanggaran_id}")
def delete_pelanggaran(pelanggaran_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan"))):
    pelanggaran = get_detail(db, pelanggaran_id)
    delete_data(db, pelanggaran_id)
    total_poin = get_total_poin_siswa(db, pelanggaran.siswa_id)
    return success_response(
        "Data pelanggaran berhasil dihapus",
        {
            "total_poin": total_poin,
            "status_pembinaan": get_status_pembinaan(total_poin),
            "rekomendasi_sp": get_rekomendasi_sp(total_poin),
        },
    )


@router.get("/siswa/{siswa_id}")
def pelanggaran_by_siswa(siswa_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"))):
    items = get_by_siswa(db, siswa_id)
    return success_response("Data pelanggaran siswa berhasil diambil", [PelanggaranRead.model_validate(item).model_dump() for item in items])


@router.get("/{pelanggaran_id}")
def detail_pelanggaran(pelanggaran_id: str, db: Session = Depends(get_db), current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas"))):
    item = get_detail(db, pelanggaran_id)
    return success_response("Detail pelanggaran berhasil diambil", PelanggaranRead.model_validate(item).model_dump())
