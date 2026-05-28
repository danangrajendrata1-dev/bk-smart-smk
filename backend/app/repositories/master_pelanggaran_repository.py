from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.master_pelanggaran_model import MasterPelanggaran


def list_master_pelanggaran(db: Session, include_inactive: bool = True) -> List[MasterPelanggaran]:
    query = db.query(MasterPelanggaran)
    if not include_inactive:
        query = query.filter(MasterPelanggaran.status == "aktif")
    return query.order_by(MasterPelanggaran.created_at.desc()).all()


def get_master_pelanggaran(db: Session, item_id: str) -> Optional[MasterPelanggaran]:
    return db.query(MasterPelanggaran).filter(MasterPelanggaran.id == item_id).first()


def get_master_by_jenis(db: Session, jenis_pelanggaran: str) -> Optional[MasterPelanggaran]:
    return db.query(MasterPelanggaran).filter(MasterPelanggaran.jenis_pelanggaran == jenis_pelanggaran).first()


def create_master_pelanggaran(db: Session, item: MasterPelanggaran) -> MasterPelanggaran:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def delete_master_pelanggaran(db: Session, item: MasterPelanggaran) -> MasterPelanggaran:
    item.status = "nonaktif"
    db.commit()
    db.refresh(item)
    return item
