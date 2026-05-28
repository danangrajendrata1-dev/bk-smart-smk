from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.schemas.surat_peringatan_schema import (
    SuratPeringatanCreate,
    SuratPeringatanRecommendationResponse,
    SuratPeringatanResponse,
    SuratPeringatanUpdate,
)
from app.services.surat_peringatan_service import (
    build_whatsapp_link,
    create_data,
    delete_data,
    generate_sp_pdf,
    get_detail,
    get_rekomendasi,
    list_data,
    update_data,
)
from app.utils.response import success_response

router = APIRouter(prefix="/surat-peringatan", tags=["surat_peringatan"])


@router.get("")
def list_surat_peringatan(
    siswa_id: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    jenis_sp: str | None = Query(default=None),
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas")),
):
    items = list_data(db, {
        "siswa_id": siswa_id,
        "kelas_id": kelas_id,
        "jenis_sp": jenis_sp,
        "tanggal_awal": tanggal_awal,
        "tanggal_akhir": tanggal_akhir,
    })
    return success_response("Data surat peringatan berhasil diambil", [SuratPeringatanResponse.model_validate(item).model_dump() for item in items])


@router.get("/siswa/{siswa_id}")
def list_surat_peringatan_by_siswa(
    siswa_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas")),
):
    items = list_data(db, {"siswa_id": siswa_id})
    return success_response("Data surat peringatan siswa berhasil diambil", [SuratPeringatanResponse.model_validate(item).model_dump() for item in items])


@router.get("/rekomendasi/{siswa_id}")
def rekomendasi_sp(
    siswa_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas")),
):
    data = get_rekomendasi(db, siswa_id)
    return success_response("Rekomendasi surat peringatan berhasil diambil", data)


@router.get("/{sp_id}")
def detail_surat_peringatan(
    sp_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas")),
):
    item = get_detail(db, sp_id)
    return success_response("Detail surat peringatan berhasil diambil", SuratPeringatanResponse.model_validate(item).model_dump())


@router.post("")
def create_surat_peringatan(
    payload: SuratPeringatanCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan")),
):
    item = create_data(db, payload, current_user)
    return success_response("Surat peringatan berhasil dibuat", SuratPeringatanResponse.model_validate(item).model_dump())


@router.put("/{sp_id}")
def update_surat_peringatan(
    sp_id: str,
    payload: SuratPeringatanUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk")),
):
    item = update_data(db, sp_id, payload)
    return success_response("Surat peringatan berhasil diubah", SuratPeringatanResponse.model_validate(item).model_dump())


@router.delete("/{sp_id}")
def delete_surat_peringatan(
    sp_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk")),
):
    delete_data(db, sp_id)
    return success_response("Surat peringatan berhasil dihapus", {})


@router.post("/{sp_id}/generate-pdf")
def generate_pdf(
    sp_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan")),
):
    item = generate_sp_pdf(db, sp_id)
    return success_response("PDF surat peringatan berhasil dibuat", SuratPeringatanResponse.model_validate(item).model_dump())


@router.get("/{sp_id}/download-pdf")
def download_pdf(
    sp_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah", "wali_kelas")),
):
    item = get_detail(db, sp_id)
    if not item.file_pdf_url:
        raise HTTPException(status_code=404, detail="PDF belum tersedia")
    file_path = Path(item.file_pdf_url.lstrip("/"))
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File PDF tidak ditemukan")
    return FileResponse(path=str(file_path), filename=file_path.name, media_type="application/pdf")
