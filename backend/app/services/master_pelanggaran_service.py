from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.master_pelanggaran_model import MasterPelanggaran
from app.repositories.master_pelanggaran_repository import (
    create_master_pelanggaran as repo_create_master,
    delete_master_pelanggaran as repo_delete_master,
    get_master_by_jenis,
    get_master_pelanggaran as repo_get_master,
    list_master_pelanggaran as repo_list_master,
)
from app.schemas.master_pelanggaran_schema import MasterPelanggaranCreate, MasterPelanggaranUpdate
from app.utils.crud_helper import new_id, now_utc


def list_data(db: Session):
    return repo_list_master(db)


def get_detail(db: Session, item_id: str):
    item = repo_get_master(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Master pelanggaran tidak ditemukan")
    return item


def create_data(db: Session, payload: MasterPelanggaranCreate):
    if get_master_by_jenis(db, payload.jenis_pelanggaran):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Jenis pelanggaran sudah digunakan")
    item = MasterPelanggaran(
        id=new_id(),
        jenis_pelanggaran=payload.jenis_pelanggaran,
        kategori=payload.kategori,
        poin=payload.poin,
        tindakan_default=payload.tindakan_default,
        status=payload.status or "aktif",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    return repo_create_master(db, item)


def update_data(db: Session, item_id: str, payload: MasterPelanggaranUpdate):
    item = get_detail(db, item_id)
    data = payload.model_dump(exclude_unset=True)
    if "jenis_pelanggaran" in data and data["jenis_pelanggaran"] and data["jenis_pelanggaran"] != item.jenis_pelanggaran and get_master_by_jenis(db, data["jenis_pelanggaran"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Jenis pelanggaran sudah digunakan")
    for field, value in data.items():
        setattr(item, field, value)
    item.updated_at = now_utc()
    db.commit()
    db.refresh(item)
    return item


def delete_data(db: Session, item_id: str):
    item = get_detail(db, item_id)
    return repo_delete_master(db, item)
