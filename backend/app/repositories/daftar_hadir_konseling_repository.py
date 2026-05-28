from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.daftar_hadir_konseling_model import DaftarHadirKonseling


def get_all(db: Session, filters: dict | None = None) -> List[DaftarHadirKonseling]:
    query = db.query(DaftarHadirKonseling)
    filters = filters or {}
    if filters.get("tanggal_awal"):
        query = query.filter(DaftarHadirKonseling.tanggal >= filters["tanggal_awal"])
    if filters.get("tanggal_akhir"):
        query = query.filter(DaftarHadirKonseling.tanggal <= filters["tanggal_akhir"])
    if filters.get("siswa_id"):
        query = query.filter(DaftarHadirKonseling.siswa_id == filters["siswa_id"])
    if filters.get("konseling_id"):
        query = query.filter(DaftarHadirKonseling.konseling_id == filters["konseling_id"])
    if filters.get("status_hadir"):
        query = query.filter(DaftarHadirKonseling.status_hadir == filters["status_hadir"])
    return query.order_by(DaftarHadirKonseling.created_at.desc()).all()


def get_by_id(db: Session, item_id: str) -> Optional[DaftarHadirKonseling]:
    return db.query(DaftarHadirKonseling).filter(DaftarHadirKonseling.id == item_id).first()


def get_by_konseling_id(db: Session, konseling_id: str) -> List[DaftarHadirKonseling]:
    return db.query(DaftarHadirKonseling).filter(DaftarHadirKonseling.konseling_id == konseling_id).order_by(DaftarHadirKonseling.created_at.desc()).all()


def get_by_siswa_id(db: Session, siswa_id: str) -> List[DaftarHadirKonseling]:
    return db.query(DaftarHadirKonseling).filter(DaftarHadirKonseling.siswa_id == siswa_id).order_by(DaftarHadirKonseling.created_at.desc()).all()


def get_existing(db: Session, konseling_id: str, siswa_id: str) -> Optional[DaftarHadirKonseling]:
    return db.query(DaftarHadirKonseling).filter(
        DaftarHadirKonseling.konseling_id == konseling_id,
        DaftarHadirKonseling.siswa_id == siswa_id,
    ).first()


def create(db: Session, item: DaftarHadirKonseling) -> DaftarHadirKonseling:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update(db: Session, item: DaftarHadirKonseling) -> DaftarHadirKonseling:
    db.commit()
    db.refresh(item)
    return item


def delete_or_soft_delete(db: Session, item: DaftarHadirKonseling) -> DaftarHadirKonseling:
    db.delete(item)
    db.commit()
    return item
