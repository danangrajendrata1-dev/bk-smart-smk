from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.pemanggilan_ortu_model import PemanggilanOrtu


def get_all(db: Session, filters: dict | None = None) -> List[PemanggilanOrtu]:
    query = db.query(PemanggilanOrtu)
    filters = filters or {}
    if filters.get("siswa_id"):
        query = query.filter(PemanggilanOrtu.siswa_id == filters["siswa_id"])
    if filters.get("kelas_id"):
        query = query.filter(PemanggilanOrtu.kelas_id == filters["kelas_id"])
    if filters.get("status"):
        query = query.filter(PemanggilanOrtu.status == filters["status"])
    if filters.get("tanggal_awal"):
        query = query.filter(PemanggilanOrtu.tanggal >= filters["tanggal_awal"])
    if filters.get("tanggal_akhir"):
        query = query.filter(PemanggilanOrtu.tanggal <= filters["tanggal_akhir"])
    return query.order_by(PemanggilanOrtu.created_at.desc()).all()


def get_by_id(db: Session, item_id: str) -> Optional[PemanggilanOrtu]:
    return db.query(PemanggilanOrtu).filter(PemanggilanOrtu.id == item_id).first()


def get_by_siswa_id(db: Session, siswa_id: str) -> List[PemanggilanOrtu]:
    return db.query(PemanggilanOrtu).filter(PemanggilanOrtu.siswa_id == siswa_id).order_by(PemanggilanOrtu.created_at.desc()).all()


def create(db: Session, item: PemanggilanOrtu) -> PemanggilanOrtu:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update(db: Session, item: PemanggilanOrtu) -> PemanggilanOrtu:
    db.commit()
    db.refresh(item)
    return item


def delete_or_soft_delete(db: Session, item: PemanggilanOrtu) -> PemanggilanOrtu:
    db.delete(item)
    db.commit()
    return item
