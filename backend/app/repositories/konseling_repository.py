from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.konseling_model import Konseling


def get_all(db: Session, filters: dict | None = None) -> List[Konseling]:
    query = db.query(Konseling).filter(Konseling.is_deleted == "false")
    filters = filters or {}
    if filters.get("siswa_id"):
        query = query.filter(Konseling.siswa_id == filters["siswa_id"])
    if filters.get("kelas_id"):
        query = query.filter(Konseling.kelas_id == filters["kelas_id"])
    if filters.get("jenis_konseling"):
        query = query.filter(Konseling.jenis_konseling == filters["jenis_konseling"])
    if filters.get("status"):
        query = query.filter(Konseling.status == filters["status"])
    if filters.get("tanggal_awal"):
        query = query.filter(Konseling.tanggal >= filters["tanggal_awal"])
    if filters.get("tanggal_akhir"):
        query = query.filter(Konseling.tanggal <= filters["tanggal_akhir"])
    return query.order_by(Konseling.created_at.desc()).all()


def get_by_id(db: Session, konseling_id: str) -> Optional[Konseling]:
    return db.query(Konseling).filter(Konseling.id == konseling_id, Konseling.is_deleted == "false").first()


def get_by_siswa_id(db: Session, siswa_id: str) -> List[Konseling]:
    return db.query(Konseling).filter(Konseling.siswa_id == siswa_id, Konseling.is_deleted == "false").order_by(Konseling.created_at.desc()).all()


def create(db: Session, item: Konseling) -> Konseling:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update(db: Session, item: Konseling) -> Konseling:
    db.commit()
    db.refresh(item)
    return item


def delete_or_soft_delete(db: Session, item: Konseling) -> Konseling:
    item.is_deleted = "true"
    db.commit()
    db.refresh(item)
    return item
