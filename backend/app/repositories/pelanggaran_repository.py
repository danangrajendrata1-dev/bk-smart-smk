from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.pelanggaran_model import Pelanggaran


def list_pelanggaran(db: Session) -> List[Pelanggaran]:
    return db.query(Pelanggaran).filter(Pelanggaran.is_deleted == "false").order_by(Pelanggaran.created_at.desc()).all()


def get_pelanggaran(db: Session, pelanggaran_id: str) -> Optional[Pelanggaran]:
    return db.query(Pelanggaran).filter(Pelanggaran.id == pelanggaran_id, Pelanggaran.is_deleted == "false").first()


def list_pelanggaran_by_siswa(db: Session, siswa_id: str) -> List[Pelanggaran]:
    return db.query(Pelanggaran).filter(Pelanggaran.siswa_id == siswa_id, Pelanggaran.is_deleted == "false").order_by(Pelanggaran.created_at.desc()).all()


def create_pelanggaran(db: Session, pelanggaran: Pelanggaran) -> Pelanggaran:
    db.add(pelanggaran)
    db.commit()
    db.refresh(pelanggaran)
    return pelanggaran


def delete_pelanggaran(db: Session, pelanggaran: Pelanggaran) -> Pelanggaran:
    pelanggaran.is_deleted = "true"
    db.commit()
    db.refresh(pelanggaran)
    return pelanggaran
