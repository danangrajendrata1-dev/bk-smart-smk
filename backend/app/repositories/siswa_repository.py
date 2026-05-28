from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.siswa_model import Siswa


def list_siswa(db: Session, search: str | None = None, kelas_id: str | None = None, status_siswa: str | None = None) -> List[Siswa]:
    query = db.query(Siswa)
    if search:
        like = f"%{search}%"
        query = query.filter((Siswa.nama_lengkap.ilike(like)) | (Siswa.nis.ilike(like)))
    if kelas_id:
        query = query.filter(Siswa.kelas_id == kelas_id)
    if status_siswa:
        query = query.filter(Siswa.status_siswa == status_siswa)
    return query.order_by(Siswa.created_at.desc()).all()


def get_siswa(db: Session, siswa_id: str) -> Optional[Siswa]:
    return db.query(Siswa).filter(Siswa.id == siswa_id).first()


def get_siswa_by_nis(db: Session, nis: str) -> Optional[Siswa]:
    return db.query(Siswa).filter(Siswa.nis == nis).first()


def get_siswa_by_nisn(db: Session, nisn: str) -> Optional[Siswa]:
    return db.query(Siswa).filter(Siswa.nisn == nisn).first()


def create_siswa(db: Session, siswa: Siswa) -> Siswa:
    db.add(siswa)
    db.commit()
    db.refresh(siswa)
    return siswa


def delete_siswa(db: Session, siswa: Siswa) -> Siswa:
    siswa.status_siswa = "nonaktif"
    db.commit()
    db.refresh(siswa)
    return siswa
