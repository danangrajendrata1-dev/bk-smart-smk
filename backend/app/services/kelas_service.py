from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.kelas_model import Kelas
from app.repositories.siswa_repository import list_siswa as list_siswa_repo
from app.repositories.kelas_repository import (
    create_kelas as repo_create_kelas,
    delete_kelas as repo_delete_kelas,
    get_kelas as repo_get_kelas,
    get_kelas_by_name,
    list_kelas as repo_list_kelas,
)
from app.schemas.kelas_schema import KelasCreate, KelasUpdate
from app.utils.crud_helper import new_id, now_utc


def list_data(db: Session):
    return repo_list_kelas(db)


def get_detail(db: Session, kelas_id: str):
    kelas = repo_get_kelas(db, kelas_id)
    if not kelas:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Kelas tidak ditemukan")
    return kelas


def create_data(db: Session, payload: KelasCreate):
    if get_kelas_by_name(db, payload.nama_kelas):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nama kelas sudah digunakan")
    kelas = Kelas(
        id=new_id(),
        nama_kelas=payload.nama_kelas,
        tingkat=payload.tingkat,
        jurusan=payload.jurusan,
        wali_kelas_id=payload.wali_kelas_id,
        tahun_ajaran=payload.tahun_ajaran,
        status=payload.status or "aktif",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    return repo_create_kelas(db, kelas)


def update_data(db: Session, kelas_id: str, payload: KelasUpdate):
    kelas = get_detail(db, kelas_id)
    data = payload.model_dump(exclude_unset=True)
    if "nama_kelas" in data and data["nama_kelas"] and data["nama_kelas"] != kelas.nama_kelas and get_kelas_by_name(db, data["nama_kelas"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Nama kelas sudah digunakan")
    for field, value in data.items():
        setattr(kelas, field, value)
    kelas.updated_at = now_utc()
    db.commit()
    db.refresh(kelas)
    return kelas


def delete_data(db: Session, kelas_id: str):
    kelas = get_detail(db, kelas_id)
    if any(siswa.kelas_id == kelas_id for siswa in list_siswa_repo(db)):
        kelas.status = "nonaktif"
        db.commit()
        db.refresh(kelas)
        return kelas
    return repo_delete_kelas(db, kelas)
