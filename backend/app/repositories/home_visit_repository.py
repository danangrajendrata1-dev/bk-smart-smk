from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.home_visit_model import HomeVisit


def get_all(db: Session, filters: dict | None = None) -> List[HomeVisit]:
    query = db.query(HomeVisit)
    filters = filters or {}
    if filters.get("siswa_id"):
        query = query.filter(HomeVisit.siswa_id == filters["siswa_id"])
    if filters.get("kelas_id"):
        query = query.filter(HomeVisit.kelas_id == filters["kelas_id"])
    if filters.get("status"):
        query = query.filter(HomeVisit.status == filters["status"])
    if filters.get("tanggal_awal"):
        query = query.filter(HomeVisit.tanggal_kunjungan >= filters["tanggal_awal"])
    if filters.get("tanggal_akhir"):
        query = query.filter(HomeVisit.tanggal_kunjungan <= filters["tanggal_akhir"])
    return query.order_by(HomeVisit.created_at.desc()).all()


def get_by_id(db: Session, item_id: str) -> Optional[HomeVisit]:
    return db.query(HomeVisit).filter(HomeVisit.id == item_id).first()


def get_by_siswa_id(db: Session, siswa_id: str) -> List[HomeVisit]:
    return db.query(HomeVisit).filter(HomeVisit.siswa_id == siswa_id).order_by(HomeVisit.created_at.desc()).all()


def create(db: Session, item: HomeVisit) -> HomeVisit:
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update(db: Session, item: HomeVisit) -> HomeVisit:
    db.commit()
    db.refresh(item)
    return item


def delete_or_soft_delete(db: Session, item: HomeVisit) -> HomeVisit:
    db.delete(item)
    db.commit()
    return item
