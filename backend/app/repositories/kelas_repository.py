from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.kelas_model import Kelas


def list_kelas(db: Session, include_inactive: bool = True) -> List[Kelas]:
    query = db.query(Kelas)
    if not include_inactive:
        query = query.filter(Kelas.status == "aktif")
    return query.order_by(Kelas.created_at.desc()).all()


def get_kelas(db: Session, kelas_id: str) -> Optional[Kelas]:
    return db.query(Kelas).filter(Kelas.id == kelas_id).first()


def get_kelas_by_name(db: Session, nama_kelas: str) -> Optional[Kelas]:
    return db.query(Kelas).filter(Kelas.nama_kelas == nama_kelas).first()


def create_kelas(db: Session, kelas: Kelas) -> Kelas:
    db.add(kelas)
    db.commit()
    db.refresh(kelas)
    return kelas


def delete_kelas(db: Session, kelas: Kelas) -> Kelas:
    kelas.status = "nonaktif"
    db.commit()
    db.refresh(kelas)
    return kelas
