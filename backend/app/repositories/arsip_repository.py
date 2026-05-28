from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.arsip_model import Arsip


def list_arsip(db: Session, filters: dict | None = None) -> List[Arsip]:
    query = db.query(Arsip)
    filters = filters or {}
    if filters.get("siswa_id"):
        query = query.filter(Arsip.siswa_id == filters["siswa_id"])
    if filters.get("jenis_dokumen"):
        query = query.filter(Arsip.jenis_dokumen == filters["jenis_dokumen"])
    if filters.get("tanggal_awal"):
        query = query.filter(Arsip.tanggal >= filters["tanggal_awal"])
    if filters.get("tanggal_akhir"):
        query = query.filter(Arsip.tanggal <= filters["tanggal_akhir"])
    return query.order_by(Arsip.created_at.desc()).all()


def get_arsip(db: Session, item_id: str) -> Optional[Arsip]:
    return db.query(Arsip).filter(Arsip.id == item_id).first()


def create_arsip(db: Session, item: Arsip) -> Arsip:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
