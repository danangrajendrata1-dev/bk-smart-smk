from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.pemanggilan_ortu_model import PemanggilanOrtu
from app.repositories.kelas_repository import get_kelas
from app.repositories.pemanggilan_ortu_repository import create as repo_create, delete_or_soft_delete as repo_delete, get_all as repo_get_all, get_by_id as repo_get_by_id, get_by_siswa_id as repo_get_by_siswa_id, update as repo_update
from app.repositories.siswa_repository import get_siswa
from app.services.arsip_service import create_data as create_arsip_data
from app.schemas.arsip_schema import ArsipCreate
from app.utils.crud_helper import new_id, now_utc


def _serialize(item: PemanggilanOrtu) -> dict:
    return {
        "id": item.id,
        "tanggal": item.tanggal,
        "siswa_id": item.siswa_id,
        "kelas_id": item.kelas_id,
        "alasan_pemanggilan": item.alasan_pemanggilan,
        "hasil_pertemuan": item.hasil_pertemuan,
        "kesepakatan": item.kesepakatan,
        "dokumentasi_url": item.dokumentasi_url,
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
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pemanggilan orang tua tidak ditemukan")
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
    item = PemanggilanOrtu(
        id=new_id(),
        tanggal=payload.tanggal or datetime.utcnow().strftime("%Y-%m-%d"),
        siswa_id=siswa.id,
        kelas_id=kelas.id,
        alasan_pemanggilan=payload.alasan_pemanggilan,
        hasil_pertemuan=payload.hasil_pertemuan,
        kesepakatan=payload.kesepakatan,
        dokumentasi_url=payload.dokumentasi_url,
        tanda_tangan_ortu=payload.tanda_tangan_ortu,
        petugas_id=getattr(current_user, "id", ""),
        status=payload.status or "dijadwalkan",
        created_at=now_utc(),
        updated_at=now_utc(),
    )
    created = repo_create(db, item)
    if created.status == "selesai" and created.dokumentasi_url:
        create_arsip_data(
            db,
            ArsipCreate(
                tanggal=created.tanggal,
                jenis_dokumen="pemanggilan_ortu",
                siswa_id=created.siswa_id,
                judul_dokumen=f"Pemanggilan Orang Tua {created.id}",
                file_url=created.dokumentasi_url,
                keterangan=created.alasan_pemanggilan,
            ),
            created.petugas_id,
        )
    return _serialize(created)


def update_data(db: Session, item_id: str, payload, current_user):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pemanggilan orang tua tidak ditemukan")
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
    for field in ("tanggal", "alasan_pemanggilan", "hasil_pertemuan", "kesepakatan", "dokumentasi_url", "tanda_tangan_ortu", "status"):
        if field in data and data[field] is not None:
            setattr(item, field, data[field])
    item.updated_at = now_utc()
    updated = repo_update(db, item)
    if updated.status == "selesai" and updated.dokumentasi_url:
        create_arsip_data(
            db,
            ArsipCreate(
                tanggal=updated.tanggal,
                jenis_dokumen="pemanggilan_ortu",
                siswa_id=updated.siswa_id,
                judul_dokumen=f"Pemanggilan Orang Tua {updated.id}",
                file_url=updated.dokumentasi_url,
                keterangan=updated.alasan_pemanggilan,
            ),
            updated.petugas_id,
        )
    return _serialize(updated)


def delete_data(db: Session, item_id: str):
    item = repo_get_by_id(db, item_id)
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pemanggilan orang tua tidak ditemukan")
    repo_delete(db, item)


def get_by_siswa(db: Session, siswa_id: str, current_user):
    if current_user.role == "wali_kelas":
        siswa = get_siswa(db, siswa_id)
        if not siswa or siswa.kelas_id != getattr(current_user, "kelas_id", siswa.kelas_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Akses ditolak")
    return [_serialize(item) for item in repo_get_by_siswa_id(db, siswa_id)]
