from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.konseling_model import Konseling
from app.repositories.kelas_repository import get_kelas
from app.repositories.konseling_repository import (
    create as repo_create,
    delete_or_soft_delete as repo_delete,
    get_all as repo_get_all,
    get_by_id as repo_get_by_id,
    get_by_siswa_id as repo_get_by_siswa_id,
    update as repo_update,
)
from app.repositories.daftar_hadir_konseling_repository import get_by_konseling_id as get_daftar_hadir_by_konseling
from app.repositories.siswa_repository import get_siswa
from app.schemas.konseling_schema import KonselingCreate, KonselingDetailResponse, KonselingUpdate
from app.utils.crud_helper import new_id, now_utc


ALLOWED_PRIVATE_ROLES = {"admin", "guru_bk"}


def _serialize(item: Konseling, role: str) -> dict:
    data = {
        "id": item.id,
        "tanggal": item.tanggal,
        "siswa_id": item.siswa_id,
        "kelas_id": item.kelas_id,
        "jenis_konseling": item.jenis_konseling,
        "permasalahan": item.permasalahan,
        "hasil_konseling": item.hasil_konseling,
        "tindak_lanjut": item.tindak_lanjut,
        "jadwal_berikutnya": item.jadwal_berikutnya,
        "konselor_id": item.konselor_id,
        "status": item.status,
        "created_at": item.created_at,
        "updated_at": item.updated_at,
    }
    if role in ALLOWED_PRIVATE_ROLES:
        data["catatan_rahasia"] = item.catatan_rahasia
    return data


def _serialize_with_presence(item: Konseling, role: str) -> dict:
    data = _serialize(item, role)
    data["daftar_hadir"] = []
    return data


def list_data(db: Session, current_user, filters: dict | None = None):
    items = repo_get_all(db, filters)
    return [_serialize(item, current_user.role) for item in items]


def get_detail(db: Session, konseling_id: str, current_user):
    item = repo_get_by_id(db, konseling_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Konseling tidak ditemukan")
    if current_user.role == "wali_kelas":
        siswa = get_siswa(db, item.siswa_id)
        if not siswa or siswa.kelas_id != getattr(current_user, "kelas_id", siswa.kelas_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
    data = _serialize(item, current_user.role)
    data["daftar_hadir"] = [
        {
            "id": hadir.id,
            "konseling_id": hadir.konseling_id,
            "siswa_id": hadir.siswa_id,
            "tanggal": hadir.tanggal,
            "waktu_hadir": hadir.waktu_hadir,
            "tanda_tangan_siswa": hadir.tanda_tangan_siswa,
            "status_hadir": hadir.status_hadir,
            "catatan": hadir.catatan,
            "created_by": hadir.created_by,
            "created_at": hadir.created_at,
            "updated_at": hadir.updated_at,
        }
        for hadir in get_daftar_hadir_by_konseling(db, konseling_id)
    ]
    return data


def create_data(db: Session, payload: KonselingCreate, current_user):
    siswa = get_siswa(db, payload.siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")
    kelas = get_kelas(db, siswa.kelas_id)
    if not kelas:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kelas siswa tidak valid")
    item = Konseling(
        id=new_id(),
        tanggal=payload.tanggal,
        siswa_id=siswa.id,
        kelas_id=kelas.id,
        jenis_konseling=payload.jenis_konseling,
        permasalahan=payload.permasalahan,
        hasil_konseling=payload.hasil_konseling,
        tindak_lanjut=payload.tindak_lanjut,
        jadwal_berikutnya=payload.jadwal_berikutnya,
        konselor_id=getattr(current_user, "id", ""),
        catatan_rahasia=payload.catatan_rahasia,
        status=payload.status or "terjadwal",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    created = repo_create(db, item)
    return _serialize(created, current_user.role)


def update_data(db: Session, konseling_id: str, payload: KonselingUpdate, current_user):
    item = repo_get_by_id(db, konseling_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Konseling tidak ditemukan")
    data = payload.model_dump(exclude_unset=True)
    if "siswa_id" in data and data["siswa_id"]:
        siswa = get_siswa(db, data["siswa_id"])
        if not siswa:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")
        item.siswa_id = siswa.id
        kelas = get_kelas(db, siswa.kelas_id)
        if kelas:
            item.kelas_id = kelas.id
    for field in ("tanggal", "jenis_konseling", "permasalahan", "hasil_konseling", "tindak_lanjut", "jadwal_berikutnya", "catatan_rahasia", "status"):
        if field in data:
            setattr(item, field, data[field])
    item.updated_at = now_utc()
    updated = repo_update(db, item)
    return _serialize(updated, current_user.role)


def delete_data(db: Session, konseling_id: str):
    item = repo_get_by_id(db, konseling_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Konseling tidak ditemukan")
    repo_delete(db, item)


def get_by_siswa(db: Session, siswa_id: str, current_user):
    items = repo_get_by_siswa_id(db, siswa_id)
    return [_serialize(item, current_user.role) for item in items]


def get_jadwal_hari_ini(db: Session, current_user):
    today = now_utc().strftime("%Y-%m-%d")
    items = repo_get_all(db, {"tanggal_awal": today, "tanggal_akhir": today})
    return [_serialize(item, current_user.role) for item in items]


def get_presence_by_konseling(db: Session, konseling_id: str):
    return [
        {
            "id": hadir.id,
            "konseling_id": hadir.konseling_id,
            "siswa_id": hadir.siswa_id,
            "tanggal": hadir.tanggal,
            "waktu_hadir": hadir.waktu_hadir,
            "tanda_tangan_siswa": hadir.tanda_tangan_siswa,
            "status_hadir": hadir.status_hadir,
            "catatan": hadir.catatan,
            "created_by": hadir.created_by,
            "created_at": hadir.created_at,
            "updated_at": hadir.updated_at,
        }
        for hadir in get_daftar_hadir_by_konseling(db, konseling_id)
    ]
