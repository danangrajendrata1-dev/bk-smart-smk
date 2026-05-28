from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.daftar_hadir_konseling_model import DaftarHadirKonseling
from app.repositories.daftar_hadir_konseling_repository import (
    create as repo_create,
    delete_or_soft_delete as repo_delete,
    get_all as repo_get_all,
    get_by_id as repo_get_by_id,
    get_by_konseling_id as repo_get_by_konseling_id,
    get_by_siswa_id as repo_get_by_siswa_id,
    get_existing as repo_get_existing,
    update as repo_update,
)
from app.repositories.konseling_repository import get_by_id as get_konseling
from app.repositories.siswa_repository import get_siswa
from app.utils.crud_helper import new_id, now_utc

ALLOWED_ROLES = {"admin", "guru_bk", "wali_kelas", "kesiswaan", "kepala_sekolah"}


def _serialize(item: DaftarHadirKonseling) -> dict:
    return {
        "id": item.id,
        "konseling_id": item.konseling_id,
        "siswa_id": item.siswa_id,
        "tanggal": item.tanggal,
        "waktu_hadir": item.waktu_hadir,
        "tanda_tangan_siswa": item.tanda_tangan_siswa,
        "status_hadir": item.status_hadir,
        "catatan": item.catatan,
        "created_by": item.created_by,
        "created_at": item.created_at,
        "updated_at": item.updated_at,
    }


def list_data(db: Session, filters: dict | None = None, current_user=None):
    items = repo_get_all(db, filters)
    return [_serialize(item) for item in items]


def get_detail(db: Session, item_id: str, current_user):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daftar hadir konseling tidak ditemukan")
    if current_user.role == "wali_kelas":
        siswa = get_siswa(db, item.siswa_id)
        if not siswa or siswa.kelas_id != getattr(current_user, "kelas_id", siswa.kelas_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
    return _serialize(item)


def create_data(db: Session, payload, current_user):
    konseling = get_konseling(db, payload.konseling_id)
    if not konseling:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Konseling tidak valid")

    siswa_id = payload.siswa_id or konseling.siswa_id
    siswa = get_siswa(db, siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")

    if repo_get_existing(db, payload.konseling_id, siswa_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Daftar hadir untuk konseling dan siswa yang sama sudah ada")

    status_hadir = payload.status_hadir or "hadir"
    if status_hadir not in {"hadir", "tidak_hadir", "izin"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Status hadir tidak valid")

    if status_hadir == "hadir" and not payload.tanda_tangan_siswa:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tanda tangan siswa wajib jika status hadir")

    tanggal = payload.tanggal or datetime.utcnow().strftime("%Y-%m-%d")
    waktu_hadir = payload.waktu_hadir
    if status_hadir == "hadir" and not waktu_hadir:
        waktu_hadir = datetime.utcnow().strftime("%H:%M")

    item = DaftarHadirKonseling(
        id=new_id(),
        konseling_id=payload.konseling_id,
        siswa_id=siswa_id,
        tanggal=tanggal,
        waktu_hadir=waktu_hadir,
        tanda_tangan_siswa=payload.tanda_tangan_siswa,
        status_hadir=status_hadir,
        catatan=payload.catatan,
        created_by=getattr(current_user, "id", ""),
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    created = repo_create(db, item)
    return _serialize(created)


def update_data(db: Session, item_id: str, payload, current_user):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daftar hadir konseling tidak ditemukan")

    data = payload.model_dump(exclude_unset=True)
    if "konseling_id" in data and data["konseling_id"]:
        konseling = get_konseling(db, data["konseling_id"])
        if not konseling:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Konseling tidak valid")
        item.konseling_id = data["konseling_id"]
        if "siswa_id" not in data or not data.get("siswa_id"):
            item.siswa_id = konseling.siswa_id

    if "siswa_id" in data and data["siswa_id"]:
        siswa = get_siswa(db, data["siswa_id"])
        if not siswa:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")
        item.siswa_id = siswa.id

    for field in ("tanggal", "waktu_hadir", "tanda_tangan_siswa", "status_hadir", "catatan"):
        if field in data:
            setattr(item, field, data[field])

    if item.status_hadir == "hadir" and not item.tanda_tangan_siswa:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tanda tangan siswa wajib jika status hadir")

    item.updated_at = now_utc()
    updated = repo_update(db, item)
    return _serialize(updated)


def delete_data(db: Session, item_id: str):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daftar hadir konseling tidak ditemukan")
    repo_delete(db, item)


def get_by_konseling(db: Session, konseling_id: str, current_user):
    items = repo_get_by_konseling_id(db, konseling_id)
    return [_serialize(item) for item in items]


def get_by_siswa(db: Session, siswa_id: str, current_user):
    items = repo_get_by_siswa_id(db, siswa_id)
    return [_serialize(item) for item in items]
