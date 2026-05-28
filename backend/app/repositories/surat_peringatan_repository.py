from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.surat_peringatan_model import SuratPeringatan


def list_surat_peringatan(db: Session, filters: dict | None = None) -> List[SuratPeringatan]:
    query = db.query(SuratPeringatan)
    filters = filters or {}
    if filters.get("siswa_id"):
        query = query.filter(SuratPeringatan.siswa_id == filters["siswa_id"])
    if filters.get("kelas_id"):
        query = query.filter(SuratPeringatan.kelas_id == filters["kelas_id"])
    if filters.get("jenis_sp"):
        query = query.filter(SuratPeringatan.jenis_sp == filters["jenis_sp"])
    if filters.get("tanggal_awal"):
        query = query.filter(SuratPeringatan.tanggal_sp >= filters["tanggal_awal"])
    if filters.get("tanggal_akhir"):
        query = query.filter(SuratPeringatan.tanggal_sp <= filters["tanggal_akhir"])
    return query.order_by(SuratPeringatan.created_at.desc()).all()


def get_surat_peringatan(db: Session, sp_id: str) -> Optional[SuratPeringatan]:
    return db.query(SuratPeringatan).filter(SuratPeringatan.id == sp_id).first()


def get_existing_sp(db: Session, siswa_id: str, jenis_sp: str) -> Optional[SuratPeringatan]:
    return (
        db.query(SuratPeringatan)
        .filter(SuratPeringatan.siswa_id == siswa_id, SuratPeringatan.jenis_sp == jenis_sp)
        .first()
    )


def get_by_siswa_id(db: Session, siswa_id: str) -> List[SuratPeringatan]:
    return (
        db.query(SuratPeringatan)
        .filter(SuratPeringatan.siswa_id == siswa_id)
        .order_by(SuratPeringatan.created_at.desc())
        .all()
    )


def get_last_by_type(db: Session, jenis_sp: str) -> Optional[SuratPeringatan]:
    return (
        db.query(SuratPeringatan)
        .filter(SuratPeringatan.jenis_sp == jenis_sp)
        .order_by(SuratPeringatan.created_at.desc())
        .first()
    )


def create_surat_peringatan(db: Session, sp: SuratPeringatan) -> SuratPeringatan:
    db.add(sp)
    db.commit()
    db.refresh(sp)
    return sp


def update_surat_peringatan(db: Session, sp: SuratPeringatan) -> SuratPeringatan:
    db.commit()
    db.refresh(sp)
    return sp


def delete_surat_peringatan(db: Session, sp: SuratPeringatan) -> SuratPeringatan:
    db.delete(sp)
    db.commit()
    return sp
