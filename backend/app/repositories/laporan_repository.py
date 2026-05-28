from __future__ import annotations

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.home_visit_model import HomeVisit
from app.models.konseling_model import Konseling
from app.models.pelanggaran_model import Pelanggaran
from app.models.pemanggilan_ortu_model import PemanggilanOrtu
from app.models.presensi_model import Presensi
from app.models.surat_peringatan_model import SuratPeringatan


def _between_date(column, start: str | None, end: str | None):
    if start and end:
        return column.between(start, end)
    if start:
        return column >= start
    if end:
        return column <= end
    return None


def count_summary(db: Session) -> dict:
    return {
        "total_pelanggaran": db.query(func.count(Pelanggaran.id)).filter(Pelanggaran.is_deleted != "true").scalar() or 0,
        "total_konseling": db.query(func.count(Konseling.id)).filter(Konseling.is_deleted != "true").scalar() or 0,
        "total_sp": db.query(func.count(SuratPeringatan.id)).scalar() or 0,
        "total_pemanggilan_ortu": db.query(func.count(PemanggilanOrtu.id)).scalar() or 0,
        "total_home_visit": db.query(func.count(HomeVisit.id)).scalar() or 0,
        "total_presensi": db.query(func.count(Presensi.id)).scalar() or 0,
    }


def list_presensi(db: Session, filters: dict | None = None):
    filters = filters or {}
    query = db.query(Presensi)
    date_filter = _between_date(Presensi.tanggal, filters.get("tanggal_awal"), filters.get("tanggal_akhir"))
    if date_filter is not None:
        query = query.filter(date_filter)
    if filters.get("kelas_id"):
        query = query.filter(Presensi.kelas_id == filters["kelas_id"])
    if filters.get("siswa_id"):
        query = query.filter(Presensi.siswa_id == filters["siswa_id"])
    if filters.get("status"):
        query = query.filter(Presensi.status == filters["status"])
    return query.order_by(Presensi.tanggal.desc()).all()


def list_pelanggaran(db: Session, filters: dict | None = None):
    filters = filters or {}
    query = db.query(Pelanggaran).filter(Pelanggaran.is_deleted != "true")
    date_filter = _between_date(Pelanggaran.tanggal_kejadian, filters.get("tanggal_awal"), filters.get("tanggal_akhir"))
    if date_filter is not None:
        query = query.filter(date_filter)
    if filters.get("kelas_id"):
        query = query.filter(Pelanggaran.kelas_id == filters["kelas_id"])
    if filters.get("siswa_id"):
        query = query.filter(Pelanggaran.siswa_id == filters["siswa_id"])
    if filters.get("jenis_pelanggaran"):
        query = query.filter(Pelanggaran.master_pelanggaran_id == filters["jenis_pelanggaran"])
    if filters.get("status"):
        query = query.filter(Pelanggaran.status_tindak_lanjut == filters["status"])
    return query.order_by(Pelanggaran.tanggal_kejadian.desc()).all()


def list_konseling(db: Session, filters: dict | None = None):
    filters = filters or {}
    query = db.query(Konseling).filter(Konseling.is_deleted != "true")
    date_filter = _between_date(Konseling.tanggal, filters.get("tanggal_awal"), filters.get("tanggal_akhir"))
    if date_filter is not None:
        query = query.filter(date_filter)
    if filters.get("kelas_id"):
        query = query.filter(Konseling.kelas_id == filters["kelas_id"])
    if filters.get("siswa_id"):
        query = query.filter(Konseling.siswa_id == filters["siswa_id"])
    if filters.get("jenis_konseling"):
        query = query.filter(Konseling.jenis_konseling == filters["jenis_konseling"])
    if filters.get("status"):
        query = query.filter(Konseling.status == filters["status"])
    return query.order_by(Konseling.tanggal.desc()).all()


def list_sp(db: Session, filters: dict | None = None):
    filters = filters or {}
    query = db.query(SuratPeringatan)
    date_filter = _between_date(SuratPeringatan.tanggal_sp, filters.get("tanggal_awal"), filters.get("tanggal_akhir"))
    if date_filter is not None:
        query = query.filter(date_filter)
    if filters.get("kelas_id"):
        query = query.filter(SuratPeringatan.kelas_id == filters["kelas_id"])
    if filters.get("siswa_id"):
        query = query.filter(SuratPeringatan.siswa_id == filters["siswa_id"])
    if filters.get("jenis_sp"):
        query = query.filter(SuratPeringatan.jenis_sp == filters["jenis_sp"])
    return query.order_by(SuratPeringatan.tanggal_sp.desc()).all()


def list_pemanggilan_ortu(db: Session, filters: dict | None = None):
    filters = filters or {}
    query = db.query(PemanggilanOrtu)
    date_filter = _between_date(PemanggilanOrtu.tanggal, filters.get("tanggal_awal"), filters.get("tanggal_akhir"))
    if date_filter is not None:
        query = query.filter(date_filter)
    if filters.get("kelas_id"):
        query = query.filter(PemanggilanOrtu.kelas_id == filters["kelas_id"])
    if filters.get("siswa_id"):
        query = query.filter(PemanggilanOrtu.siswa_id == filters["siswa_id"])
    if filters.get("status"):
        query = query.filter(PemanggilanOrtu.status == filters["status"])
    return query.order_by(PemanggilanOrtu.tanggal.desc()).all()


def list_home_visit(db: Session, filters: dict | None = None):
    filters = filters or {}
    query = db.query(HomeVisit)
    date_filter = _between_date(HomeVisit.tanggal_kunjungan, filters.get("tanggal_awal"), filters.get("tanggal_akhir"))
    if date_filter is not None:
        query = query.filter(date_filter)
    if filters.get("kelas_id"):
        query = query.filter(HomeVisit.kelas_id == filters["kelas_id"])
    if filters.get("siswa_id"):
        query = query.filter(HomeVisit.siswa_id == filters["siswa_id"])
    if filters.get("status"):
        query = query.filter(HomeVisit.status == filters["status"])
    return query.order_by(HomeVisit.tanggal_kunjungan.desc()).all()
