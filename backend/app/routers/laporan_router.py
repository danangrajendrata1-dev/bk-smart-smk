from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.permissions import require_roles
from app.services.laporan_service import (
    get_home_visit,
    get_konseling,
    get_presensi,
    get_pemanggilan_ortu,
    get_pelanggaran,
    get_surat_peringatan,
    get_summary,
)

router = APIRouter(prefix="/laporan", tags=["laporan"])


@router.get("/summary")
def laporan_summary(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah")),
):
    return get_summary(db)


@router.get("/pelanggaran")
def laporan_pelanggaran(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    jenis_pelanggaran: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah")),
):
    return get_pelanggaran(
        db,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "kelas_id": kelas_id,
            "siswa_id": siswa_id,
            "jenis_pelanggaran": jenis_pelanggaran,
            "status": status,
        },
    )


@router.get("/presensi")
def laporan_presensi(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah")),
):
    return get_presensi(
        db,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "kelas_id": kelas_id,
            "siswa_id": siswa_id,
            "status": status,
        },
    )


@router.get("/konseling")
def laporan_konseling(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    jenis_konseling: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah")),
):
    return get_konseling(
        db,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "kelas_id": kelas_id,
            "siswa_id": siswa_id,
            "jenis_konseling": jenis_konseling,
            "status": status,
        },
    )


@router.get("/surat-peringatan")
def laporan_surat_peringatan(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    jenis_sp: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah")),
):
    return get_surat_peringatan(
        db,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "kelas_id": kelas_id,
            "siswa_id": siswa_id,
            "jenis_sp": jenis_sp,
        },
    )


@router.get("/pemanggilan-ortu")
def laporan_pemanggilan_ortu(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah")),
):
    return get_pemanggilan_ortu(
        db,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "kelas_id": kelas_id,
            "siswa_id": siswa_id,
            "status": status,
        },
    )


@router.get("/home-visit")
def laporan_home_visit(
    tanggal_awal: str | None = Query(default=None),
    tanggal_akhir: str | None = Query(default=None),
    kelas_id: str | None = Query(default=None),
    siswa_id: str | None = Query(default=None),
    status: str | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("admin", "guru_bk", "kesiswaan", "kepala_sekolah")),
):
    return get_home_visit(
        db,
        {
            "tanggal_awal": tanggal_awal,
            "tanggal_akhir": tanggal_akhir,
            "kelas_id": kelas_id,
            "siswa_id": siswa_id,
            "status": status,
        },
    )
