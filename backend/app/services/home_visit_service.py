from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.home_visit_model import HomeVisit
from app.repositories.home_visit_repository import create as repo_create, delete_or_soft_delete as repo_delete, get_all as repo_get_all, get_by_id as repo_get_by_id, get_by_siswa_id as repo_get_by_siswa_id, update as repo_update
from app.repositories.kelas_repository import get_kelas
from app.repositories.siswa_repository import get_siswa
from app.services.arsip_service import create_data as create_arsip_data
from app.schemas.arsip_schema import ArsipCreate
from app.utils.crud_helper import new_id, now_utc


def _serialize(item: HomeVisit) -> dict:
    return {
        "id": item.id,
        "tanggal_kunjungan": item.tanggal_kunjungan,
        "siswa_id": item.siswa_id,
        "kelas_id": item.kelas_id,
        "alamat": item.alamat,
        "tujuan": item.tujuan,
        "hasil_observasi": item.hasil_observasi,
        "kesimpulan": item.kesimpulan,
        "foto_kunjungan_url": item.foto_kunjungan_url,
        "tanda_tangan_ortu": item.tanda_tangan_ortu,
        "petugas_id": item.petugas_id,
        "status": item.status,
        "created_at": item.created_at,
        "updated_at": item.updated_at,
    }


def list_data(db: Session, filters: dict | None = None, current_user=None):
    return [_serialize(item) for item in repo_get_all(db, filters)]


def get_detail(db: Session, item_id: str, current_user):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Home visit tidak ditemukan")
    if current_user.role == "wali_kelas":
        siswa = get_siswa(db, item.siswa_id)
        if not siswa or siswa.kelas_id != getattr(current_user, "kelas_id", siswa.kelas_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
    return _serialize(item)


def create_data(db: Session, payload, current_user):
    siswa = get_siswa(db, payload.siswa_id)
    if not siswa:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")
    kelas = get_kelas(db, siswa.kelas_id)
    if not kelas:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kelas siswa tidak valid")
    item = HomeVisit(
        id=new_id(),
        tanggal_kunjungan=payload.tanggal_kunjungan or datetime.utcnow().strftime("%Y-%m-%d"),
        siswa_id=siswa.id,
        kelas_id=kelas.id,
        alamat=payload.alamat or siswa.alamat or "",
        tujuan=payload.tujuan,
        hasil_observasi=payload.hasil_observasi,
        kesimpulan=payload.kesimpulan,
        foto_kunjungan_url=payload.foto_kunjungan_url,
        tanda_tangan_ortu=payload.tanda_tangan_ortu,
        petugas_id=getattr(current_user, "id", ""),
        status=payload.status or "dijadwalkan",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    created = repo_create(db, item)
    if created.status == "selesai" and created.foto_kunjungan_url:
        create_arsip_data(
            db,
            ArsipCreate(
                tanggal=created.tanggal_kunjungan,
                jenis_dokumen="home_visit",
                siswa_id=created.siswa_id,
                judul_dokumen=f"Home Visit {created.id}",
                file_url=created.foto_kunjungan_url,
                keterangan=created.kesimpulan,
            ),
            created.petugas_id,
        )
    return _serialize(created)


def update_data(db: Session, item_id: str, payload, current_user):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Home visit tidak ditemukan")
    data = payload.model_dump(exclude_unset=True)
    if "siswa_id" in data and data["siswa_id"]:
        siswa = get_siswa(db, data["siswa_id"])
        if not siswa:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Siswa tidak valid")
        kelas = get_kelas(db, siswa.kelas_id)
        if not kelas:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kelas siswa tidak valid")
        item.siswa_id = siswa.id
        item.kelas_id = kelas.id
    for field in ("tanggal_kunjungan", "alamat", "tujuan", "hasil_observasi", "kesimpulan", "foto_kunjungan_url", "tanda_tangan_ortu", "status"):
        if field in data and data[field] is not None:
            setattr(item, field, data[field])
    item.updated_at = now_utc()
    updated = repo_update(db, item)
    if updated.status == "selesai" and updated.foto_kunjungan_url:
        create_arsip_data(
            db,
            ArsipCreate(
                tanggal=updated.tanggal_kunjungan,
                jenis_dokumen="home_visit",
                siswa_id=updated.siswa_id,
                judul_dokumen=f"Home Visit {updated.id}",
                file_url=updated.foto_kunjungan_url,
                keterangan=updated.kesimpulan,
            ),
            updated.petugas_id,
        )
    return _serialize(updated)


def delete_data(db: Session, item_id: str):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Home visit tidak ditemukan")
    repo_delete(db, item)


def get_by_siswa(db: Session, siswa_id: str, current_user):
    if current_user.role == "wali_kelas":
        siswa = get_siswa(db, siswa_id)
        if not siswa or siswa.kelas_id != getattr(current_user, "kelas_id", siswa.kelas_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
    return [_serialize(item) for item in repo_get_by_siswa_id(db, siswa_id)]
