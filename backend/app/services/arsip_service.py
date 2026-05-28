from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.arsip_model import Arsip
from app.repositories.arsip_repository import create_arsip as repo_create_arsip, get_arsip as repo_get_arsip, list_arsip as repo_list_arsip
from app.utils.crud_helper import new_id, now_utc


def list_data(db: Session, filters: dict | None = None):
    return repo_list_arsip(db, filters)


def get_detail(db: Session, item_id: str):
    item = repo_get_arsip(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Arsip dokumen tidak ditemukan")
    return item


def create_data(db: Session, payload, uploaded_by: str):
    item = Arsip(
        id=new_id(),
        tanggal=payload.tanggal or datetime.utcnow().strftime("%Y-%m-%d"),
        jenis_dokumen=payload.jenis_dokumen,
        siswa_id=payload.siswa_id,
        judul_dokumen=payload.judul_dokumen,
        file_url=payload.file_url,
        keterangan=payload.keterangan,
        uploaded_by=uploaded_by,
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    return repo_create_arsip(db, item)
